from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="My App API", version="1.0.0")

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GitProvider(BaseModel):
    id: int
    account_id: int
    installation_id: int
    name: str
    provider: str

class GitRepository(BaseModel):
    FullName: str
    Kind: str

# Create App Models (based on curl request structure)
class ImageConfig(BaseModel):
    repository: str
    tag: str

class BuildConfig(BaseModel):
    context: str
    method: str
    dockerfile: str
    repository: str

class AutoscalingConfig(BaseModel):
    type: str
    enabled: bool
    min_instances: int
    max_instances: int
    cpu_threshold_percent: int
    memory_threshold_percent: int

class DomainConfig(BaseModel):
    name: str

class HealthCheckConfig(BaseModel):
    enabled: bool
    http_path: str
    command: str
    timeout_seconds: int
    initial_delay_seconds: int

class ServiceConfig(BaseModel):
    name: str
    run: str
    type: str
    instances: int
    cpuCores: int
    ramMegabytes: int
    sleep: bool
    port: int
    autoscaling: AutoscalingConfig
    domains: List[DomainConfig]
    health_check: HealthCheckConfig
    private: bool

class VariableConfig(BaseModel):
    key: str
    value: str

class EnvironmentGroupConfig(BaseModel):
    name: str

class CreateAppRequest(BaseModel):
    image: ImageConfig
    build: BuildConfig
    services: List[ServiceConfig]
    variables: List[VariableConfig]
    environment_groups: List[EnvironmentGroupConfig]
    name: str
    deployment_target_id: str
    secrets: List[VariableConfig]

@app.get("/")
async def root():
    return {"message": "Hello World from FastAPI!"}

@app.get("/api/projects/{project_id}/integrations/git", response_model=List[GitProvider])
async def get_git_providers(project_id: int):
    # Mock data based on spec
    mock_providers = [
        {
            "id": 1,
            "account_id": 12345678,
            "installation_id": 87654321,
            "name": "My GitHub Organization",
            "provider": "github"
        },
        {
            "id": 2,
            "account_id": 98765432,
            "installation_id": 13579246,
            "name": "Personal GitHub",
            "provider": "github"
        }
    ]

    return mock_providers

@app.get("/api/projects/{project_id}/gitrepos/{git_repo_id}/repos", response_model=List[GitRepository])
async def get_git_repositories(project_id: int, git_repo_id: int):
    # Mock repository data
    mock_repositories = [
        {
            "FullName": "janesmith/Hello-World",
            "Kind": "github"
        },
        {
            "FullName": "janesmith/my-nextjs-app",
            "Kind": "github"
        },
        {
            "FullName": "janesmith/react-portfolio",
            "Kind": "github"
        },
        {
            "FullName": "janesmith/backend-api",
            "Kind": "github"
        }
    ]

    return mock_repositories

@app.get("/api/projects/{project_id}/gitrepos/{installation_id}/repos/{kind}/{owner}/{name}/branches", response_model=List[str])
async def get_repository_branches(project_id: int, installation_id: int, kind: str, owner: str, name: str):
    # Mock branch data
    mock_branches = [
        "main",
        "develop",
        "feature/user-authentication",
        "feature/new-ui-components",
        "hotfix/security-patch",
        "release/v1.2.0"
    ]

    return mock_branches

@app.post("/api/projects/{project_id}/clusters/{cluster_id}/apps", status_code=201)
async def create_app(project_id: int, cluster_id: int, app_data: CreateAppRequest):
    # Mock successful app creation
    return {
        "message": "Application created successfully",
        "app_name": app_data.name,
        "deployment_target_id": app_data.deployment_target_id,
        "project_id": project_id,
        "cluster_id": cluster_id
    }
