variable "resource_group_location" {
  default     = "japaneast"
  description = "Location of the resource group."
}

variable "prefix" {
  type        = string
  default     = "to-do-app"
  description = "Prefix of the resource name"
}

variable "admin_password" {
  type      = string
  default   = "!phuC122!phuC122"
  sensitive = true
}