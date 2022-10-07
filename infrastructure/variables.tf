
variable "aws_region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "ap-southeast-2"
}

variable "environment" {
  description = "Deployment environment ({developer-name}, test, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "The project/component name"
  type        = string
  default     = "calc"
}



