resource "aws_lambda_permission" "allow_cloudwatch_to_invoke_fetch_dca_vaults" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.fetch_dca_vaults_lambda.this.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_minute.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_invoke_notifications" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.send_vault_notifications_lambda.this.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.vault_events.arn
}
