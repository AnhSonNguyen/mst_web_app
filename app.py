from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.rank = [0] * (n + 1)

    def find(self, u):
        if self.parent[u] != u:
            self.parent[u] = self.find(self.parent[u])
        return self.parent[u]

    def unite(self, u, v):
        root_u = self.find(u)
        root_v = self.find(v)
        if root_u != root_v:
            if self.rank[root_u] > self.rank[root_v]:
                self.parent[root_v] = root_u
            elif self.rank[root_u] < self.rank[root_v]:
                self.parent[root_u] = root_v
            else:
                self.parent[root_v] = root_u
                self.rank[root_u] += 1

def kruskal(n, edges):
    edges.sort(key=lambda x: x[2])
    ds = DisjointSet(n)
    result = []
    total_weight = 0
    for u, v, w in edges:
        if ds.find(u) != ds.find(v):
            ds.unite(u, v)
            result.append((u, v, w))
            total_weight += w
    return result, total_weight

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/mst', methods=['POST'])
def mst():
    data = request.get_json()
    n = data['n']
    edges = data['edges']
    mst_edges, total = kruskal(n, edges)
    return jsonify({'mst': mst_edges, 'total_weight': total})

if __name__ == '__main__':
    app.run(debug=True)
