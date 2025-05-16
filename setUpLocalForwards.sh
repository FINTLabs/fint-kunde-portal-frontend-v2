#!/bin/bash

# kubectl config use-context aks-api-fint-2022-02-08

services=(
  "fint-kunde-portal-backend"
  "fint-link-walker"
  "fint-test-runner-kotlin"
  "fint-samtykke-admin-backend"
  "fint-core-access-control"
)
ports=(
  "8080:8080"
  "8086:8080"
  "8088:8080"
  "8084:8080"
  "8085:8080"
)

NAMESPACE="fintlabs-no"

start_port_forwarding() {
  echo "Starting port-forwarding for services..."
  for i in "${!services[@]}"; do
    echo "Starting port-forwarding for ${services[$i]} on ${ports[$i]}"

    output=$(kubectl port-forward service/"${services[$i]}" ${ports[$i]} -n $NAMESPACE > /dev/null 2>&1 & echo $!)
    if [[ $? -ne 0 ]]; then
      echo "Error: Failed to start port-forwarding for ${services[$i]} on ${ports[$i]}."
      echo "Details: $output"
    else
      echo "Port-forwarding started for ${services[$i]} on ${ports[$i]}"
    fi
  done
  echo "All port-forwarding processes attempted."
}

stop_port_forwarding() {
  echo "Stopping port-forwarding for services..."
  for service in "${services[@]}"; do
    echo "Stopping port-forwarding for $service"

    output=$(pkill -f "kubectl port-forward service/$service" 2>&1)
    if [[ $? -ne 0 ]]; then
      echo "Error: Failed to stop port-forwarding for $service."
      echo "Details: $output"
    else
      echo "Port-forwarding stopped for $service"
    fi
  done
  echo "All port-forwarding processes stopped (or attempted)."
}

case "$1" in
  start)
    start_port_forwarding
    ;;
  stop)
    stop_port_forwarding
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac