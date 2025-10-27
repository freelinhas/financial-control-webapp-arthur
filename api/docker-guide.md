We need to run code below before all

`
  run --name postgres-financial \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=financial_control \
    -p 5432:5432 \
    -d postgres:15
`