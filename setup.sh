docker run -d -p 9090:9090 -v $(pwd)/prometheus-config.yml:/etc/prometheus/prometheus.yml -v $(pwd)/prometheus-data:/prometheus prom/prometheus
docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss
docker run -d -p 3100:3100 --name=loki grafana/loki
