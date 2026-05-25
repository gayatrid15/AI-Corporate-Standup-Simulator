import random
from scenarios.scenario_bank import SCENARIOS


def get_random_scenario():
    return random.choice(SCENARIOS)
