let map = L.map('map').setView([10.76, 106.66], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let coordinates = {};
let edges = [];
let mstEdges = [];

let markers = [];
let lines = [];

document.getElementById('submitData').addEventListener('click', parseInput);
document.getElementById('runKruskal').addEventListener('click', drawMST);
document.getElementById('resetMap').addEventListener('click', resetMap); // Gắn nút Reset

function parseInput() {
    coordinates = {};
    edges = [];

    // Xóa cũ
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    lines.forEach(line => map.removeLayer(line));
    lines = [];

    let input = document.getElementById('dataInput').value.trim().split('\n');

    for (let line of input) {
        let parts = line.trim().split(',');

        // Nếu là tọa độ đỉnh: A,10.76,106.66
        if (parts.length === 3 && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
            let [label, lat, lng] = parts;
            coordinates[label] = [parseFloat(lat), parseFloat(lng)];
            let marker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map)
                .bindPopup(`Đỉnh ${label}`);
            marker.openPopup();
            markers.push(marker);
        }

        // Nếu là cạnh: A,B,4
        else if (parts.length === 3 && !isNaN(Number(parts[2]))) {
            let [u, v, w] = parts;
            edges.push([u, v, parseFloat(w)]);
        }
    }

    alert("Đã nhập dữ liệu thành công!");
}

function drawMST() {
    // Xóa các đường MST cũ
    lines.forEach(line => map.removeLayer(line));
    lines = [];

    let vertices = Object.keys(coordinates);
    let parent = {};
    for (let v of vertices) parent[v] = v;

    function find(u) {
        if (parent[u] !== u) parent[u] = find(parent[u]);
        return parent[u];
    }

    function union(u, v) {
        let rootU = find(u);
        let rootV = find(v);
        if (rootU !== rootV) {
            parent[rootV] = rootU;
            return true;
        }
        return false;
    }

    edges.sort((a, b) => a[2] - b[2]);

    mstEdges = [];
    let totalWeight = 0;

    for (let [u, v, w] of edges) {
        if (union(u, v)) {
            mstEdges.push([u, v]);
            totalWeight += w;

            let latlngs = [coordinates[u], coordinates[v]];
            let line = L.polyline(latlngs, { color: 'red' }).addTo(map);
            lines.push(line);
        }
    }

    alert(`Tổng trọng số của cây khung nhỏ nhất: ${totalWeight}`);
}

function resetMap() {
    // Xóa marker và đường nối
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    lines.forEach(line => map.removeLayer(line));
    lines = [];

    // Reset dữ liệu
    coordinates = {};
    edges = [];
    mstEdges = [];

    // Xóa textarea
    document.getElementById('dataInput').value = "";

    alert("Đã reset thành công!");
}
