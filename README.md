# Supabase AWS boilerplate

## What it is
This is a boilerplate that allows you to bootstrap your project with basic common functionalities.

## What it is not
* This boilerplate uses supabase function hooks which as of right now is in beta so use the function hooks with cautious or remove it completely.
* This project does not provide best practices, and it's very opinionated 

## Features
1. Organization/Role based resource control
2. Automatic creation of org on user registration
3. Team member invitation

## Role enforcing
To limit the access to specific table the function `public.member_can_do(org_id, action_code)` is used.
You can define your own action codes by changing the definition of `member_can_do` function.

## Before start
If you decide to use supabase function hooks you have to first enable it in supabase cloud.
Go to `Database` menu and then go to `Function hooks` and enable the functionality.

## Rollback
Since by default postgresql user does not own auth.users table when we create a trigger on that table then we can not drop the trigger.
Read more about it [here](https://github.com/supabase/supabase/issues/3445).

To roll back a trigger on auth.users table you either have to give appropriate role to postgres user or run these queries in supabase dashboard. 
```sql
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS handle_auth_user_update ON auth.users;
```

## Deploying
1. Create an AWS account
2. Create an AWS access key
3. Create a supabase cloud account or create your own instance
4. Install serverless in your machine
5. Copy .env.example to .env
6. For SUPABASE_HOOK_SECRET generate a random value and for the rest you can get them from your supabase instance
7. Run `AWS_ACCESS_KEY_ID=your-aws-access-key-id AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key serverless deploy --stage dev`
8. Once the deploy is done you will get a url in the output of serverless. That's your webhook url.
9. Create a repository in github
10. Copy the file `pipline-examples/github.yml` to `.github/workflows/deploy.yml`
11. Set the following secrets in the github repository
    1. SUPABASE_HOST_DEV: The host to your supabase instance. You can get this by going to `Settings` > `Database` under Connection info section
    2. SUPABASE_PASSWORD_DEV: The password for postgresql user
    3. WEBHOOK_URL_DEV: The url you got from serverless deploy
    4. WEBHOOK_SECRET_DEV: The webhook secret you generated
    5. AWS_ACCESS_KEY_ID_DEV: The access key id you got from AWS
    6. AWS_SECRET_ACCESS_KEY_DEV: The secret access key you got from AWS

## Self hosted supabase
Currently self hosted does not support function hooks so if you are planning to use this boilerplate with a self hosted
instance make sure you remove the code for `aws_organization_invitations_insert` trigger from `1640538574-organization-invitations.up.sql` and 1640538574-organization-invitations.down.sql