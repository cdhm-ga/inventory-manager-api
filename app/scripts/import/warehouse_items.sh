#!/usr/bin/env bash

# bulk load data

mongoimport --db=inventory-manager-api-development --collection=warehouseItems --type=csv --headerline --file=lib/seeds.csv
