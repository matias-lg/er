import matplotlib.pyplot as plt
import numpy as np
import json

# Sample array element
# {
#     "input": {
#       "erdoc": {
#         "entities": 131,
#         "relations": 20,
#         "aggregations": 5
#       },
#       "graph": {
#         "nodes": 544,
#         "edges": 475
#       }
#     },
#     "results": {
#       "processing": {
#         "parser": {
#           "mean": 4.016234001144767,
#           "std": 0
#         },
#         "linter": {
#           "mean": 2.4002689998596907,
#           "std": 0
#         },
#         "er2graph": {
#           "mean": 2.6537900008261204,
#           "std": 0
#         },
#         "all": {
#           "mean": 10.438306998461485,
#           "std": 0
#         }
#       },
#       "layout": {
#         "elk2k": {
#           "mean": 19165.827090000734,
#           "std": 0
#         },
#         "elk5k": {
#           "mean": 38088.40805600025,
#           "std": 0
#         },
#         "cola": {
#           "mean": 48891.19422299974,
#           "std": 0
#         },
#         "multi": {
#           "mean": 424.63946600072086,
#           "std": 0
#         }
#       }
#     }
#   }

FILENAME = "src/eval/eval-results.json"
data = json.loads(open(FILENAME).read())

erdoc_items = []
graph_items = []

times = {
    "parser": [],
    "linter": [],
    "er2graph": [],
}

layoutTimes = {
    "elk2k": [],
    "elk5k": [],
    "cola": [],
    "multi": [],
}

for case in data:
    print(case["input"]["graph"], case["input"]["erdoc"])
    erdoc_items.append(
        case["input"]["erdoc"]["entities"]
        + case["input"]["erdoc"]["relations"]
        + case["input"]["erdoc"]["aggregations"]
    )

    graph_items.append(
        case["input"]["graph"]["nodes"] + case["input"]["graph"]["edges"]
    )

    times["parser"].append(case["results"]["processing"]["parser"]["mean"])
    times["linter"].append(case["results"]["processing"]["linter"]["mean"])
    times["er2graph"].append(case["results"]["processing"]["er2graph"]["mean"])

    layoutTimes["elk2k"].append(case["results"]["layout"]["elk2k"]["mean"])
    layoutTimes["elk5k"].append(case["results"]["layout"]["elk5k"]["mean"])
    layoutTimes["cola"].append(case["results"]["layout"]["cola"]["mean"])
    layoutTimes["multi"].append(case["results"]["layout"]["multi"]["mean"])


# One stacked bar chart for processing times for each element
width = 3

fig, ax = plt.subplots()
bottom = np.zeros(len(erdoc_items))

for proc, stats in times.items():
    p = ax.bar(erdoc_items, stats, width, label=proc, bottom=bottom)
    bottom += stats

ax.set_title("Time for processing ER documents")
ax.legend(loc="upper right")
plt.show()

# one line chart for layout times for each element
fig2, ax2 = plt.subplots()
for layout, stats in layoutTimes.items():
    # print(erdoc_items)
    # print(stats)
    if layout != "multi":
        continue
    xy = zip(graph_items, stats)
    xy = sorted(xy, key=lambda x: x[0])
    for x, y in xy:
        print(f"({x} {y})")

    

    plt.plot(graph_items, stats,'o', label= "elk 2000" if layout == "elk2k" else "elk 5000" if layout == "elk5k" else layout) 
    ax2.set_title("Time for layouting graphs")
    ax2.legend(loc="upper right")
plt.show()