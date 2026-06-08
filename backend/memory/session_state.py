from typing import TypedDict, List, Dict, Any


class SessionState(TypedDict):

    # Conversation
    messages: List[Dict[str, str]]
    candidate_claims: List[str]
    contradictions: List[str]

    # Evaluation
    evaluation_notes: List[str]
    evaluation_flags: List[str]

    # Engagement
    engagement_score: int
    disengagement_count: int
    continue_check_required: bool

    # Flow
    conversation_started: bool
    interview_complete: bool

    # Question Tracking
    current_question_index: int
    current_question_text: str
    followup_count: int
    current_followup_index: int

    # Scenario
    scenario: Dict[str, Any]

    # candidate role
    candidate_role: str

    # Final Evaluation
    final_report: Dict[str, Any]
