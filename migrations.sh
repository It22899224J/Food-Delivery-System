#!/bin/bash

# Enable error handling and verbose output
set -e
set -o pipefail

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service configurations (with deployment name mapping)
declare -A SERVICES=(
  ["auth-service"]="./apps/auth/prisma/schema.prisma"
  ["order-service"]="./apps/order/prisma/schema.prisma" 
  ["payment-service"]="./apps/payment/prisma/schema.prisma"

)

function run_migration() {
  local deployment=$1
  local schema=$2
  local service_name=${deployment%-service}  # Remove -service suffix for display
  
  echo -e "${YELLOW}🚀 Running migrations for ${service_name}...${NC}"
  echo -e "Schema path: ${schema}"
  
  if kubectl get deployment/${deployment} > /dev/null 2>&1; then
    # Generate and apply migrations
    kubectl exec -it deployment/${deployment} -- \
      npx prisma migrate dev --name init --schema=${schema} --create-only
    
    # Apply the migration
    kubectl exec -it deployment/${deployment} -- \
      npx prisma migrate deploy --schema=${schema}
    
    # Verify migration status
    echo -e "${YELLOW}🔍 Verifying migration status...${NC}"
    kubectl exec -it deployment/${deployment} -- \
      npx prisma migrate status --schema=${schema} | grep -q "Database schema is up to date" \
      && echo -e "${GREEN}✅ ${service_name} migrations successful!${NC}" \
      || { echo -e "${RED}❌ ${service_name} migration failed${NC}"; exit 1; }
  else
    echo -e "${RED}❌ Deployment ${deployment} not found${NC}"
    exit 1
  fi
}

# Main execution
echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW} Starting Food Delivery System Migrations ${NC}"
echo -e "${YELLOW}==========================================${NC}"

for deployment in "${!SERVICES[@]}"; do
  run_migration "$deployment" "${SERVICES[$deployment]}"
  echo -e "${YELLOW}------------------------------------------${NC}"
done

echo -e "${GREEN}🎉 All migrations completed successfully!${NC}"