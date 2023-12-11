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
    "all": [],
}

stds = {
    "parser": [],
    "linter": [],
    "er2graph": [],
    "all": [],
}

layoutTimes = {
    "elk2k": [],
    "elk5k": [],
    "cola": [],
    "multi": [],
}

layoutStds = {
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
    times["all"].append(case["results"]["processing"]["all"]["mean"])

    layoutTimes["elk2k"].append(case["results"]["layout"]["elk2k"]["mean"])
    layoutTimes["elk5k"].append(case["results"]["layout"]["elk5k"]["mean"])
    layoutTimes["cola"].append(case["results"]["layout"]["cola"]["mean"])
    layoutTimes["multi"].append(case["results"]["layout"]["multi"]["mean"])

    stds["parser"].append(case["results"]["processing"]["parser"]["std"])
    stds["linter"].append(case["results"]["processing"]["linter"]["std"])
    stds["er2graph"].append(case["results"]["processing"]["er2graph"]["std"])
    stds["all"].append(case["results"]["processing"]["all"]["std"])

    layoutStds["elk2k"].append(case["results"]["layout"]["elk2k"]["std"])
    layoutStds["elk5k"].append(case["results"]["layout"]["elk5k"]["std"])
    layoutStds["cola"].append(case["results"]["layout"]["cola"]["std"])
    layoutStds["multi"].append(case["results"]["layout"]["multi"]["std"])


# One stacked bar chart for processing times for each element
width = 2

fig, ax = plt.subplots()
bottom = np.zeros(len(erdoc_items))

# for proc, stats in times.items():
#     p = ax.bar(erdoc_items, stats, width, label=proc, bottom=bottom)
#     bottom += stats

default_style = '-o'

parser_tuples = sorted(
    zip(erdoc_items, times["parser"], stds["parser"]), key=lambda x: x[0])

linter_tuples = sorted(
    zip(erdoc_items, times['linter'], stds['linter']), key=lambda x: x[0])

er2graph_tuples = sorted(zip(erdoc_items, np.array(
    times["er2graph"]), stds['er2graph']), key=lambda x: x[0])

all_tuples = sorted(zip(erdoc_items, times["all"], stds["all"]), key=lambda x: x[0])
    


parser_x, parser_y, parser_std = zip(*parser_tuples)
linter_x, linter_y, linter_std = zip(*linter_tuples)
er2graph_x, er2graph_y, er2graph_std = zip(*er2graph_tuples)
all_x, all_y, all_std = zip(*all_tuples)



# elk2k_tuples = sorted(zip(erdoc_items, layoutTimes["elk2k"], layoutStds["elk2k"]), key=lambda x: x[0])
# elk2k_x, elk2k_y, elk2k_std = zip(*elk2k_tuples)
# ax.errorbar(elk2k_x, elk2k_y, elk2k_std, label="ELKjs 2000 iteraciones", fmt='--ro', capsize=3)
#
# elk5k_tuples = sorted(zip(erdoc_items, layoutTimes["elk5k"], layoutStds["elk5k"]), key=lambda x: x[0])
# elk5k_x, elk5k_y, elk5k_std = zip(*elk5k_tuples)
# ax.errorbar(elk5k_x, elk5k_y, elk5k_std, label="ELKjs 5000 iteraciones", fmt='--go', capsize=3)
#
# cola_tuples = sorted(zip(erdoc_items, layoutTimes["cola"], layoutStds["cola"]), key=lambda x: x[0])
# cola_x, cola_y, cola_std = zip(*cola_tuples)
# ax.errorbar(cola_x, cola_y, cola_std, label="WebCola", fmt='--yo', capsize=3)

multi_tuples = sorted(zip(erdoc_items, layoutTimes["multi"], layoutStds["multi"]), key=lambda x: x[0])
multi_x, multi_y, multi_std = zip(*multi_tuples)
ax.errorbar(multi_x, multi_y, multi_std, label="multi", fmt='--co', capsize=3)



# ax.errorbar(parser_x, parser_y, parser_std, label="parser", fmt='--o', capsize=3)
# ax.errorbar(linter_x, linter_y, linter_std, label="linter", fmt='--go', capsize=3)
# ax.errorbar(er2graph_x, er2graph_y, er2graph_std,
#             label="er2graph", fmt='--yo', capsize=3)

#ax.errorbar(all_x, all_y, all_std, label="all", fmt='--ro', capsize=3)

# ax.plot(erdoc_items, np.array(times["linter"]) + np.array(times["parser"]), default_style, label="linter")
# ax.plot(erdoc_items, np.array(times["er2graph"]) + np.array(times["linter"]) + np.array(times['parser']), default_style, label="er2graph")

ax.set_title("Tiempo de ejecución de algoritmo $\it{multi-layout}$")
ax.set_xlabel("Elementos del grafo (aristas + nodos)")
ax.set_ylabel("Tiempo (ms)")
# ticc = list(range(0, 20000, 1000))
# print(ticc)
# ax.set_yticks(ticc)
# ax.legend(loc="upper left")
plt.show()

# one line chart for layout times for each element
# fig2, ax2 = plt.subplots()
# for layout, stats in layoutTimes.items():
#     # print(erdoc_items)
#     # print(stats)
#     if layout != "multi":
#         continue
#     xy = zip(graph_items, stats)
#     xy = sorted(xy, key=lambda x: x[0])
#     for x, y in xy:
#         print(f"({x} {y})")
#
#
#
#     plt.plot(graph_items, stats,'o', label= "elk 2000" if layout == "elk2k" else "elk 5000" if layout == "elk5k" else layout)
#     ax2.set_title("Time for layouting graphs")
#     ax2.legend(loc="upper right")
# plt.show()
