def add_flag(flags, notes, flag, note):

    if flag not in flags:

        flags.append(flag)

        notes.append(note)


def evaluate_response(state, user_input, current_item):

    flags = state.setdefault("evaluation_flags", [])

    notes = []

    needs_followup = False

    cleaned_input = user_input.strip().lower()

    words = cleaned_input.split()

    # ==========================================
    # SHORT RESPONSE
    # ==========================================

    if len(words) < 5:

        needs_followup = True

        add_flag(
            flags,
            notes,
            "short_response",
            "Candidate responses are very short and lack detail.",
        )

    # ==========================================
    # VAGUE RESPONSE
    # ==========================================

    vague_phrases = [
        "not sure",
        "maybe",
        "probably",
        "i think",
        "kind of",
        "somehow",
        "i guess",
    ]

    if any(phrase in cleaned_input for phrase in vague_phrases):

        needs_followup = True

        add_flag(
            flags,
            notes,
            "vague_response",
            "Candidate responses contain uncertainty or vague reasoning.",
        )

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
    # COMMUNICATION QUALITY
    # ==========================================

    if 5 <= len(words) <= 12:

        add_flag(
            flags,
            notes,
            "good_concise_communication",
            "Candidate communicates concisely and clearly.",
        )

    # ==========================================
    # RETURN
    # ==========================================

    return {
        "needs_followup": needs_followup,
        "notes": notes,
    }
