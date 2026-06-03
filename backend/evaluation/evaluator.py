REFUSAL_PHRASES = [
    "no",
    "nope",
    "idk",
    "i dont know",
    "i don't know",
    "not sure",
    "no idea",
    "can't answer",
    "cannot answer",
    "skip",
    "pass",
    "whatever",
    "not today",
    "dont want to",
    "don't want to",
]


def add_flag(flags, notes, flag, note):
    if flag not in flags:
        flags.append(flag)
        notes.append(note)


def evaluate_response(state, user_input, current_item):
    flags = state.setdefault("evaluation_flags", [])
    notes = []

    cleaned_input = user_input.strip().lower()
    engagement_score = state.get(
        "engagement_score",
        100,
    )
    words = cleaned_input.split()

    needs_followup = False

    # ==========================================
    # IMMEDIATE LOW-CONFIDENCE ANSWERS
    # ==========================================

    low_confidence_answers = [
        "no",
        "nope",
        "idk",
        "i dont know",
        "i don't know",
        "not sure",
        "no idea",
        "can't answer",
        "cannot answer",
    ]

    if cleaned_input in low_confidence_answers:

        add_flag(
            flags,
            notes,
            "unable_to_answer",
            "Candidate could not answer the question.",
        )
        state["engagement_score"] = max(
            0,
            engagement_score - 20,
        )

        state["disengagement_count"] += 1

        if state["disengagement_count"] >= 3:
            state["continue_check_required"] = True

        return {
            "needs_followup": False,
            "notes": notes,
        }

    # ==========================================
    # SHORT RESPONSE
    # Only follow up if extremely short
    # ==========================================

    if len(words) < 3:

        needs_followup = True

        add_flag(
            flags,
            notes,
            "short_response",
            "Candidate responses are very short and lack detail.",
        )

    # ==========================================
    # VAGUE RESPONSE
    # Only follow up if BOTH vague and short
    # ==========================================

    vague_phrases = [
        "maybe",
        "probably",
        "kind of",
        "somehow",
        "i guess",
    ]

    is_vague = any(phrase in cleaned_input for phrase in vague_phrases)

    if is_vague:

        add_flag(
            flags,
            notes,
            "vague_response",
            "Candidate responses contain uncertainty or vague reasoning.",
        )

        if len(words) < 10:
            needs_followup = True

    # ==========================================
    # OWNERSHIP DETECTION
    # ==========================================

    ownership_keywords = [
        "i",
        "we",
        "implemented",
        "fixed",
        "checked",
        "reviewed",
        "deployed",
        "investigated",
        "coordinated",
    ]

    has_ownership = any(word in cleaned_input for word in ownership_keywords)

    if not has_ownership:

        add_flag(
            flags,
            notes,
            "weak_ownership",
            "Responses show limited ownership or accountability.",
        )

    # ==========================================
    # TIMELINE DETECTION
    # ==========================================

    timeline_keywords = [
        "today",
        "tomorrow",
        "eta",
        "hours",
        "minutes",
        "deadline",
        "release",
        "deployment",
        "by evening",
        "by morning",
    ]

    has_timeline = any(keyword in cleaned_input for keyword in timeline_keywords)

    timeline_topics = [
        "timeline",
        "deployment_confidence",
        "next_steps",
        "rollback_strategy",
    ]

    if current_item["topic"] in timeline_topics and not has_timeline:

        add_flag(
            flags,
            notes,
            "missing_timeline",
            "Responses lack clear delivery timelines or planning details.",
        )

    # ==========================================
    # GOOD COMMUNICATION
    # ==========================================

    if len(words) >= 8:

        add_flag(
            flags,
            notes,
            "good_concise_communication",
            "Candidate communicates clearly.",
        )

    # ==========================================
    # FOLLOWUP SAFETY
    # Long answers should almost never trigger
    # followups automatically
    # ==========================================

    if len(words) >= 15:
        needs_followup = False

    if len(words) >= 5:
        state["disengagement_count"] = 0

        state["engagement_score"] = min(
            100,
            state["engagement_score"] + 2,
        )

    # ==========================================
    # RETURN
    # ==========================================

    return {
        "needs_followup": needs_followup,
        "notes": notes,
    }
