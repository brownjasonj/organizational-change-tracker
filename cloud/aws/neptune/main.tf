terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

# GET the default vpc.
resource "aws_default_vpc" "default" {
    # tags {
    #     Name = "Default VPC"
    # }
}

#
## ------ AWS Neptune Cluster  -------------------------------------------------
# resource "aws_neptune_cluster" "example" {
#   cluster_identifier                  = "${var.neptune_name}"
#   engine                              = "neptune"
#   skip_final_snapshot                 = true
#   iam_database_authentication_enabled = false
#   apply_immediately                   = true
#   vpc_security_group_ids              = [ "${aws_security_group.neptune_example.id}" ]
#   cluster_members                     = ["${aws_neptune_cluster_instance.example.*.id}"]
# }

resource "aws_neptune_cluster" "example" {
  cluster_identifier                  = "${var.neptune_name}"
  engine                              = "neptune"
  backup_retention_period             = 5
  preferred_backup_window             = "07:00-09:00"
  skip_final_snapshot                 = true
  iam_database_authentication_enabled = false
  apply_immediately                   = true
  vpc_security_group_ids              = [ "${aws_security_group.neptune_example.id}" ]
}


resource "aws_neptune_cluster_instance" "example" {
  count              = "${var.neptune_count}"
  cluster_identifier = "${aws_neptune_cluster.example.id}"
  engine             = "neptune"
  instance_class     = "db.r4.large"
  apply_immediately  = true
}

## ------ EC2 Instance inside SG  ----------------------------------------------

resource "aws_instance" "neptune-ec2-connector" {
  ami = "ami-0c21ae4a3bd190229"
  instance_type = "t1.micro"
#   tags {
#     Name = "neptune-demo"
#   }
  vpc_security_group_ids = [ "${aws_security_group.neptune_example.id}" ]
  key_name = "testpair"
}

## ------ SGs  -----------------------------------------------------------------

resource "aws_security_group" "neptune_example" {
  name        = "${var.neptune_sg_name}"
  description = "Allow traffic for ecs"
  vpc_id      = "${aws_default_vpc.default.id}"

  ingress {
    from_port   = 8182
    to_port     = 8182
    protocol    = "tcp"
    self = true
    #security_groups = [ "${aws_security_group.neptune_example.id}" ]
  }


  # Allow SSH from anywhere...
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}