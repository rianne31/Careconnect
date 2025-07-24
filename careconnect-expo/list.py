import json
from optparse import Values
from typing import List
from pip._internal.metadata import BaseDistribution

# Assuming _ProcessedDists is defined as a list of BaseDistribution
_ProcessedDists = List[BaseDistribution]

def format_for_json(packages: _ProcessedDists, options: Values) -> str:
    data = []
    for dist in packages:
        info = {
            "name": dist.raw_name if dist.raw_name else "Unknown",
            "version": str(dist.version) if dist.version else "Unknown",
        }
        data.append(info)
    return json.dumps(data, indent=2)
