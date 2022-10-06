resource "aws_iam_role" "ecs_exec" {
  name               = "${var.project_name}-${var.environment}-ecs-exec-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role" "ecs_task" {
  name               = "${var.project_name}-${var.environment}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}
