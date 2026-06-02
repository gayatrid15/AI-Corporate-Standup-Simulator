import random
from scenarios.scenario_bank import SCENARIOS


def get_scenario_by_role(candidate_role):

    matching = [
        scenario for scenario in SCENARIOS if candidate_role in scenario["roles"]
    ]

    if not matching:
        return None

    return random.choice(matching)
