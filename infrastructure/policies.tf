data "aws_iam_policy_document" "fetch_dca_vaults" {
  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.dca_vaults_execution_queue.arn]
    actions = [
      "sqs:SendMessage",
      "sqs:GetQueueAttributes"
    ]
  }

  statement {
    effect    = "Allow"
    resources = ["arn:aws:secretsmanager:ap-southeast-2:503097572706:secret:ADMIN_CONTRACT_MNEMONIC-1NYq14"]
    actions = [
      "secretsmanager:GetSecretValue",
    ]
  }
}

resource "aws_iam_role_policy" "fetch_dca_vaults" {
  name   = "${module.fetch_dca_vaults_lambda.this.function_name}-fetch-dec-vaults"
  role   = module.fetch_dca_vaults_lambda.execution_role.id
  policy = data.aws_iam_policy_document.fetch_dca_vaults.json
}

data "aws_iam_policy_document" "execute_dca_vault" {
  statement {
    effect = "Allow"
    resources = [
      aws_sqs_queue.dca_vaults_execution_queue.arn,
    ]
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
  }

  statement {
    effect    = "Allow"
    resources = ["arn:aws:secretsmanager:ap-southeast-2:503097572706:secret:ADMIN_CONTRACT_MNEMONIC-1NYq14"]
    actions = [
      "secretsmanager:GetSecretValue",
    ]
  }
}

resource "aws_iam_role_policy" "execute_dca_vault" {
  name   = "${module.execute_dca_vault_lambda.this.function_name}-execute-dca-vaults"
  role   = module.execute_dca_vault_lambda.execution_role.id
  policy = data.aws_iam_policy_document.execute_dca_vault.json
}

data "aws_iam_policy_document" "send_vault_notifications" {
  statement {
    effect    = "Allow"
    resources = ["arn:aws:secretsmanager:ap-southeast-2:503097572706:secret:ADMIN_CONTRACT_MNEMONIC-1NYq14"]
    actions = [
      "secretsmanager:GetSecretValue",
    ]
  }
}

resource "aws_iam_role_policy" "send_vault_notifications" {
  name   = "${module.send_vault_notifications_lambda.this.function_name}-send-vault-notifications"
  role   = module.send_vault_notifications_lambda.execution_role.id
  policy = data.aws_iam_policy_document.send_vault_notifications.json
}

resource "aws_iam_role_policy" "ecs_exec" {
  name   = "${var.project_name}-${var.environment}-ecs-exec-role-policy"
  policy = data.aws_iam_policy_document.ecs_exec.json
  role   = aws_iam_role.ecs_exec.id
}

data "aws_iam_policy_document" "ecs_exec" {
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecs:DescribeTaskDefinition",
      "ecs:ListServices",
      "ecs:DescribeServices",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "secretsmanager:GetSecretValue",
      "kms:Decrypt",
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParameterHistory",
      "ssm:GetParametersByPath"
    ]
  }
}

data "aws_iam_policy_document" "ecs_task" {
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions = [
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
    ]
  }

  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.events_deduplication_queue.arn]
    actions = [
      "sqs:SendMessage",
      "sqs:GetQueueAttributes"
    ]
  }
}

resource "aws_iam_role_policy" "ecs_task" {
  name   = "${var.project_name}-${var.environment}-ecs-task-role-policy"
  policy = data.aws_iam_policy_document.ecs_task.json
  role   = aws_iam_role.ecs_task.id
}

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }
  }
}

data "aws_iam_policy_document" "publish_events" {
  statement {
    effect = "Allow"
    resources = [
      aws_sqs_queue.events_deduplication_queue.arn,
    ]
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
    ]
  }

  statement {
    effect = "Allow"
    resources = [
      "*"
    ]
    actions = [
      "events:PutEvents",
    ]
  }
}

resource "aws_iam_role_policy" "publish_events" {
  name   = "${module.publish_events_lambda.this.function_name}-publish-events"
  role   = module.publish_events_lambda.execution_role.id
  policy = data.aws_iam_policy_document.publish_events.json
}

data "aws_iam_policy_document" "ecr_push_pull" {
  statement {
    sid    = "AllowPush"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions = [
      "ecr:CompleteLayerUpload",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart"
    ]
  }
  statement {
    sid    = "AllowPull"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "ecs.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer"
    ]
  }
}
