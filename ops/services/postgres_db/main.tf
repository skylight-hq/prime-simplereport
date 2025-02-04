# NOTE
# you'll need to enable encryption manually via the GUI
resource "azurerm_postgresql_server" "db" {
  name                          = "simple-report-${var.env}-db"
  location                      = var.rg_location
  resource_group_name           = var.rg_name
  sku_name                      = var.env == "prod" ? "GP_Gen5_8" : "GP_Gen5_4"
  version                       = "11"
  ssl_enforcement_enabled       = var.tls_enabled
  public_network_access_enabled = false

  administrator_login          = var.administrator_login
  administrator_login_password = data.azurerm_key_vault_secret.db_password.value

  storage_mb                   = 102400
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  tags = var.tags

  threat_detection_policy {
    enabled              = true
    email_account_admins = true
  }

  lifecycle {
    ignore_changes = [
      identity,
      storage_mb
    ]
  }
}

resource "azurerm_postgresql_database" "simple_report" {
  charset             = "UTF8"
  collation           = "English_United States.1252"
  name                = var.db_table
  resource_group_name = var.rg_name
  server_name         = azurerm_postgresql_server.db.name
}

resource "azurerm_postgresql_configuration" "log_autovacuum_min_duration" {
  name                = "log_autovacuum_min_duration"
  resource_group_name = var.rg_name
  server_name         = azurerm_postgresql_server.db.name
  value               = 250
}

resource "azurerm_postgresql_configuration" "pg_qs_query_capture_mode" {
  name                = "pg_qs.query_capture_mode"
  resource_group_name = var.rg_name
  server_name         = azurerm_postgresql_server.db.name
  value               = "TOP"
}

resource "azurerm_postgresql_configuration" "pgms_wait_sampling_query_capture_mode" {
  name                = "pgms_wait_sampling.query_capture_mode"
  resource_group_name = var.rg_name
  server_name         = azurerm_postgresql_server.db.name
  value               = "ALL"
}

### New Postgres Flexible Server configuration
### TODO: delete the old configuration above once all environments have been cut
### over to the new DBs so Terraform can clean up the old infrastructure.

resource "azurerm_postgresql_flexible_server" "db" {
  name                = "simple-report-${var.env}-flexible-db"
  location            = var.rg_location
  resource_group_name = var.rg_name
  sku_name            = var.env == "prod" ? "MO_Standard_E8ds_v4" : "MO_Standard_E4ds_v4"
  version             = "13"
  delegated_subnet_id = var.subnet_id
  private_dns_zone_id = var.dns_zone_id

  // TODO: replace with commented-out line below when removing old DB config
  administrator_login = "simple_report"
  //administrator_login    = var.administrator_login
  administrator_password = data.azurerm_key_vault_secret.db_password.value

  storage_mb                   = 524288 // 512 GB
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false

  tags = var.tags

  // Time is Eastern
  maintenance_window {
    day_of_week  = 0
    start_hour   = 0
    start_minute = 0
  }

  # See note at https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server#high_availability
  lifecycle {
    ignore_changes = [
      zone,
      high_availability.0.standby_availability_zone
    ]
  }
}

resource "azurerm_postgresql_flexible_server_database" "simple_report" {
  charset   = "UTF8"
  collation = "en_US.utf8"
  name      = var.db_table
  server_id = azurerm_postgresql_flexible_server.db.id
}

resource "azurerm_postgresql_flexible_server_configuration" "log_autovacuum_min_duration" {
  name      = "log_autovacuum_min_duration"
  server_id = azurerm_postgresql_flexible_server.db.id
  value     = 250
}

resource "azurerm_postgresql_flexible_server_configuration" "pg_qs_query_capture_mode" {
  name      = "pg_qs.query_capture_mode"
  server_id = azurerm_postgresql_flexible_server.db.id
  value     = "TOP"
}

resource "azurerm_postgresql_flexible_server_configuration" "pgms_wait_sampling_query_capture_mode" {
  name      = "pgms_wait_sampling.query_capture_mode"
  server_id = azurerm_postgresql_flexible_server.db.id
  value     = "ALL"
}
