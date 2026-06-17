import random
from scenarios.scenario_bank import SCENARIOS


def get_scenario_by_role(candidate_role):

    print("LOOKING FOR ROLE:", repr(candidate_role))

    matching = [
        scenario for scenario in SCENARIOS if candidate_role in scenario["roles"]
    ]

    print("MATCH COUNT:", len(matching))

    if not matching:
        return None

    return random.choice(matching)
