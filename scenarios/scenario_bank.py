SCENARIOS = [
    {
        "id": 1,
        "type": "daily_standup",
        "title": "Frontend Layout Deployment",
        "difficulty": "easy",
        "candidate_context": """
        You implemented a layout update.
        QA is reviewing your PR.
        Deployment is expected today.
        """,
        "manager_context": """
        Meeting Type:
        Daily engineering standup.

        Focus on:
        - concise updates
        - blockers
        - ownership
        - deployment confidence
        - coordination

        Keep the conversation realistic and concise.
        Avoid repeatedly probing the same topic.
        Use at most 2 follow-up questions if answers are unclear.
        """,
        "evaluation_focus": [
            "clarity",
            "ownership",
            "confidence",
            "communication",
        ],
        "meeting_flow": [
            {
                "topic": "progress_update",
                "evaluation_dimension": "clarity",
                "question": "Can you walk me through what was completed yesterday?",
                "followups": [
                    "Which part of the layout update took the most time?",
                    "Was the implementation completed as planned?",
                ],
            },
            {
                "topic": "current_status",
                "evaluation_dimension": "ownership",
                "question": "What is the current deployment status?",
                "followups": [
                    "Is QA still reviewing the pull request?",
                    "Are there any pending approvals?",
                ],
            },
            {
                "topic": "blockers",
                "evaluation_dimension": "communication",
                "question": "Are there any blockers or risks right now?",
                "followups": [
                    "Do you need support from any other team?",
                    "How serious are these blockers?",
                ],
            },
            {
                "topic": "testing",
                "evaluation_dimension": "quality_awareness",
                "question": "Was regression testing completed successfully?",
                "followups": [
                    "Were any bugs discovered during testing?",
                    "Was responsiveness tested across devices?",
                ],
            },
            {
                "topic": "deployment_confidence",
                "evaluation_dimension": "confidence",
                "question": "How confident are you about today's deployment?",
                "followups": [
                    "Is there any rollback concern?",
                    "What should we monitor after deployment?",
                ],
            },
            {
                "topic": "next_steps",
                "evaluation_dimension": "planning",
                "question": "What are your next steps after deployment?",
                "followups": [
                    "Will you monitor production after release?",
                    "Are there any follow-up tasks planned?",
                ],
            },
        ],
    },
    {
        "id": 2,
        "type": "production_incident",
        "title": "API Failure After Deployment",
        "difficulty": "hard",
        "candidate_context": """
        A backend deployment yesterday introduced intermittent API failures.
        Root cause is still unclear.
        Client complaints have started coming in.
        """,
        "manager_context": """
        Meeting Type:
        Production incident discussion.

        Focus on:
        - impact assessment
        - prioritization
        - mitigation planning
        - escalation handling
        - ownership under pressure

        The conversation should feel operationally realistic.
        Challenge weak reasoning naturally.
        Avoid repetitive questioning.
        Use at most 2 follow-up questions per topic.
        """,
        "evaluation_focus": [
            "ownership",
            "technical reasoning",
            "pressure handling",
            "decision making",
        ],
        "meeting_flow": [
            {
                "topic": "incident_summary",
                "evaluation_dimension": "clarity",
                "question": "Can you summarize the production issue for me?",
                "followups": [
                    "When was the issue first detected?",
                    "Which systems are affected?",
                ],
            },
            {
                "topic": "impact_assessment",
                "evaluation_dimension": "risk_assessment",
                "question": "How severe is the customer impact right now?",
                "followups": [
                    "Are all users affected or only specific clients?",
                    "Have any enterprise customers escalated the issue?",
                ],
            },
            {
                "topic": "investigation",
                "evaluation_dimension": "technical_reasoning",
                "question": "What have you investigated so far?",
                "followups": [
                    "Did logs or monitoring reveal anything useful?",
                    "What do you currently suspect is causing the issue?",
                ],
            },
            {
                "topic": "ownership",
                "evaluation_dimension": "ownership",
                "question": "What actions did you personally take after identifying the issue?",
                "followups": [
                    "Did you coordinate with any teams?",
                    "Who was informed first?",
                ],
            },
            {
                "topic": "rollback_strategy",
                "evaluation_dimension": "decision_making",
                "question": "Do we currently have a rollback or mitigation strategy?",
                "followups": [
                    "What risks are associated with rollback?",
                    "How quickly can mitigation be deployed?",
                ],
            },
            {
                "topic": "stakeholder_communication",
                "evaluation_dimension": "communication",
                "question": "How are we communicating updates to stakeholders?",
                "followups": [
                    "What would you tell affected clients right now?",
                    "How frequently are updates being shared?",
                ],
            },
            {
                "topic": "timeline",
                "evaluation_dimension": "planning",
                "question": "What is your estimated recovery timeline?",
                "followups": [
                    "What dependencies could delay recovery?",
                    "How confident are you in that estimate?",
                ],
            },
            {
                "topic": "prevention",
                "evaluation_dimension": "problem_solving",
                "question": "How can incidents like this be prevented in the future?",
                "followups": [
                    "Would additional monitoring help?",
                    "Do deployment processes need improvement?",
                ],
            },
        ],
    },
    {
        "id": 3,
        "type": "client_escalation",
        "title": "Angry Enterprise Client",
        "difficulty": "hard",
        "candidate_context": """
        A major enterprise client is frustrated due to repeated downtime.
        They believe your team ignored earlier warnings.
        """,
        "manager_context": """
        Meeting Type:
        Client escalation discussion.

        Focus on:
        - professionalism
        - accountability
        - stakeholder management
        - communication under pressure

        Keep the tone realistic but professional.
        Avoid repetitive interrogation.
        """,
        "evaluation_focus": [
            "professionalism",
            "stakeholder communication",
            "emotional stability",
        ],
        "meeting_flow": [
            {
                "topic": "situation_understanding",
                "evaluation_dimension": "clarity",
                "question": "Can you summarize the client's concerns?",
                "followups": [
                    "What triggered the escalation?",
                    "How long has the issue been ongoing?",
                ],
            },
            {
                "topic": "accountability",
                "evaluation_dimension": "ownership",
                "question": "How would you respond to claims that warnings were ignored?",
                "followups": [
                    "Could communication have been improved?",
                    "Were concerns documented earlier?",
                ],
            },
            {
                "topic": "client_communication",
                "evaluation_dimension": "stakeholder_communication",
                "question": "How would you communicate with the client during this situation?",
                "followups": [
                    "What tone would you maintain?",
                    "How would you rebuild trust?",
                ],
            },
            {
                "topic": "recovery_plan",
                "evaluation_dimension": "decision_making",
                "question": "What immediate steps would you prioritize?",
                "followups": [
                    "What should be addressed first?",
                    "Would leadership involvement help?",
                ],
            },
            {
                "topic": "future_prevention",
                "evaluation_dimension": "problem_solving",
                "question": "How can similar escalations be avoided in the future?",
                "followups": [
                    "Would monitoring improvements help?",
                    "Should communication processes change?",
                ],
            },
        ],
    },
    {
        "id": 4,
        "type": "architecture_review",
        "title": "Microservice Scaling Review",
        "difficulty": "medium",
        "candidate_context": """
        You proposed splitting a monolith into microservices.
        Senior architects are reviewing your proposal.
        """,
        "manager_context": """
        Meeting Type:
        Architecture review discussion.

        Focus on:
        - scalability reasoning
        - tradeoff analysis
        - system design thinking
        - architectural communication

        Technical probing is acceptable.
        Challenge weak reasoning naturally.
        Avoid repetitive questioning.
        Use at most 2 follow-up questions per topic.
        """,
        "evaluation_focus": [
            "architecture knowledge",
            "tradeoff analysis",
            "technical communication",
            "scalability understanding",
        ],
        "meeting_flow": [
            {
                "topic": "architecture_summary",
                "evaluation_dimension": "technical_communication",
                "question": "Can you explain why you proposed moving to microservices?",
                "followups": [
                    "What problems are you trying to solve?",
                    "Why is the current monolith limiting us?",
                ],
            },
            {
                "topic": "service_boundaries",
                "evaluation_dimension": "architecture_knowledge",
                "question": "How would you identify service boundaries?",
                "followups": [
                    "Which modules should be separated first?",
                    "How would teams own these services?",
                ],
            },
            {
                "topic": "scalability",
                "evaluation_dimension": "scalability_understanding",
                "question": "How would microservices improve scalability?",
                "followups": [
                    "Which services are expected to scale independently?",
                    "Would database scaling also need changes?",
                ],
            },
            {
                "topic": "tradeoffs",
                "evaluation_dimension": "tradeoff_analysis",
                "question": "What tradeoffs come with moving to microservices?",
                "followups": [
                    "What operational complexity increases?",
                    "How would debugging become harder?",
                ],
            },
            {
                "topic": "communication",
                "evaluation_dimension": "system_design",
                "question": "How would services communicate with each other?",
                "followups": [
                    "Would you prefer synchronous or asynchronous communication?",
                    "How would failures between services be handled?",
                ],
            },
            {
                "topic": "deployment_strategy",
                "evaluation_dimension": "deployment_understanding",
                "question": "How would deployment strategy change after migration?",
                "followups": [
                    "Would CI/CD pipelines need restructuring?",
                    "How would rollback work across services?",
                ],
            },
            {
                "topic": "monitoring",
                "evaluation_dimension": "operational_thinking",
                "question": "How would monitoring and observability be handled?",
                "followups": [
                    "How would distributed tracing help?",
                    "What metrics would become critical?",
                ],
            },
            {
                "topic": "migration_risk",
                "evaluation_dimension": "risk_assessment",
                "question": "What risks do you foresee during migration?",
                "followups": [
                    "How would you reduce migration downtime?",
                    "Would partial migration be safer?",
                ],
            },
            {
                "topic": "long_term_maintenance",
                "evaluation_dimension": "architectural_thinking",
                "question": "How would this architecture affect long-term maintenance?",
                "followups": [
                    "Would development speed improve?",
                    "Could team coordination become harder?",
                ],
            },
        ],
    },
    {
        "id": 5,
        "type": "requirement_clarification",
        "title": "Unclear Client Requirement",
        "difficulty": "medium",
        "candidate_context": """
        Client requirements are vague.
        Stakeholders themselves are not aligned.
        """,
        "manager_context": """
        Meeting Type:
        Requirement clarification discussion.

        Focus on:
        - clarification skills
        - ambiguity handling
        - stakeholder communication
        - assumption validation

        Keep the discussion collaborative and realistic.
        Encourage thoughtful clarification questions.
        Avoid excessive probing.
        """,
        "evaluation_focus": [
            "clarification skills",
            "ambiguity handling",
            "stakeholder communication",
            "communication maturity",
        ],
        "meeting_flow": [
            {
                "topic": "requirement_understanding",
                "evaluation_dimension": "clarification_skills",
                "question": "What concerns do you have about the current requirements?",
                "followups": [
                    "Which parts are most ambiguous?",
                    "Are stakeholders aligned on priorities?",
                ],
            },
            {
                "topic": "clarification_strategy",
                "evaluation_dimension": "communication",
                "question": "How would you approach clarifying these requirements?",
                "followups": [
                    "Who would you speak with first?",
                    "Would you schedule additional discussions?",
                ],
            },
            {
                "topic": "assumption_handling",
                "evaluation_dimension": "ambiguity_handling",
                "question": "How do you avoid making unsafe assumptions?",
                "followups": [
                    "Would you document assumptions explicitly?",
                    "How would assumptions be validated?",
                ],
            },
            {
                "topic": "stakeholder_management",
                "evaluation_dimension": "stakeholder_communication",
                "question": "How would you handle conflicting stakeholder expectations?",
                "followups": [
                    "How would you prioritize conflicting requests?",
                    "Would escalation ever be necessary?",
                ],
            },
            {
                "topic": "documentation",
                "evaluation_dimension": "process_maturity",
                "question": "How would you document clarified requirements?",
                "followups": [
                    "Would acceptance criteria help?",
                    "How would changes be tracked?",
                ],
            },
            {
                "topic": "delivery_risk",
                "evaluation_dimension": "risk_management",
                "question": "What risks arise if ambiguity remains unresolved?",
                "followups": [
                    "Could delivery timelines be affected?",
                    "How could client trust be impacted?",
                ],
            },
            {
                "topic": "collaboration",
                "evaluation_dimension": "teamwork",
                "question": "How would you coordinate with engineering and product teams?",
                "followups": [
                    "Would regular sync meetings help?",
                    "How would misunderstandings be reduced?",
                ],
            },
            {
                "topic": "final_alignment",
                "evaluation_dimension": "communication_maturity",
                "question": "Before implementation begins, what would you want finalized?",
                "followups": [
                    "Should scope boundaries be documented?",
                    "Would timeline approval be required?",
                ],
            },
        ],
    },
]
