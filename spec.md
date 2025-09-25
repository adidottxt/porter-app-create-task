# Porter App Deployment Form - Complete Developer Specification

## Project Overview
Redesigned multi-step app creation flow for Porter with improved user education and streamlined experience. Desktop-focused application deployment workflow.

## Technical Stack Requirements
- **Form Management:** React Hook Form for client-side form handling
- **Validation:** React Hook Form built-in validation (no external schema libraries)
- **State Management:** Client-side only until final deployment
- **Responsiveness:** Desktop-only, no mobile optimization needed
- **Accessibility:** Basic keyboard navigation with tab support

## Overall Layout Architecture

### Page Structure
- **Sidebar:** Standard Porter navigation (Applications, Add-ons, etc.) - matches existing Porter interface
- **Main Content Area:** Centered with max-width constraint within remaining viewport
- **Fixed Header Elements:** Horizontal stepper + context bar always visible while scrolling

### Navigation Pattern
- **Stepper:** Horizontal with step numbers + titles + completion checkmarks
- **Context Bar:** Immediately below stepper, showing completed step information as individual chips
- **Page Controls:** Back + Continue buttons positioned at bottom right of content area

## Step-by-Step Implementation Specification

### Step 1: Application Setup

**Content:**
- Application name text input (required)
- Clean, minimal interface

**Validation:**
- Required field validation on blur
- No special characters/validation rules mentioned

**Navigation:**
- Button: "Configure Source" (with forward chevron icon)
- Disabled until name is provided

**Context Bar Output:**
- [App icon] `application-name`

---

### Step 2: Source Configuration

**Content Structure:**
1. **Deployment Method Selection**
   - Git repository vs Docker registry (Docker option disabled initially)
   - Educational messaging about Dockerfile confusion:
     - "Git repo handles both existing Dockerfiles and buildpack detection"
     - "Docker registry is for pre-built images from DockerHub/etc."

2. **Git Repository Flow** (when Git is selected):
   - GitHub account/organization dropdown (populated via API)
   - Repository list (populated via API based on selected account)
   - Branch selection dropdown (populated via API)
   - **Monorepo Question:** "Are you deploying from a monorepo?"
     - If yes: Explanatory message about Porter's single-service limitation

3. **Buildpack Configuration:**
   - Auto-detection display: "✓ Detected: NodeJS buildpack" (prominent)
   - "Change buildpack" option (secondary)
   - Educational tooltip: What buildpacks do and why auto-detection helps

4. **Advanced Settings** (accordion):
   - App root path (optional) - "If your app code isn't in the repo root"
   - Porter.yaml path (optional) - "Custom configuration file location"

**API Integration:**
- `GET /api/projects/{project_id}/integrations/git` - Get GitHub providers
- `GET /api/projects/{project_id}/gitrepos/{git_repo_id}/repos` - Get repository list
- `GET /api/projects/{project_id}/gitrepos/{installation_id}/repos/{kind}/{owner}/{name}/branches` - Get branches

**Validation:**
- Required: Account, repository, branch selection
- Optional: Advanced settings

**Navigation:**
- Back button: "Back" (with back chevron)
- Continue button: "Configure Services" (with forward chevron)

**Context Bar Output:**
- [GitHub icon] `account/repository`
- [Branch icon] `branch-name`
- [Buildpack icon] `NodeJS buildpack` (if detected)

---

### Step 3: Service Configuration

**Empty State:**
- Heading: "Add your application services"
- Educational descriptions:
  - **Web Service:** "Handles HTTP requests (APIs, websites)"
  - **Worker:** "Background processing (queues, async tasks)"
  - **Cron Job:** "Scheduled tasks (backups, reports)"
- "Add Service..." dropdown button (similar to provided design)

**Service Addition Flow:**
1. Click "Add Service..." dropdown
2. Select: Web Service, Worker, or Cron Job
3. Service card appears expanded at top of list
4. Default naming: `web-service-1`, `worker-service-1`, `cron-job-1`
5. Name editing via separate edit button, validation on blur
6. Numbering: Reuse lowest available number when services deleted

**Service Configuration Tabs:**

**Main Tab (all service types):**
- Start command input (required for all)
- Cron schedule input (required for cron jobs only, with validation)
- Educational tooltip for cron: "Schedule format help" with link

**Resources Tab (all service types):**
- CPU cores slider with tooltips ("0.5 cores = light API")
- RAM MB slider with tooltips ("2GB RAM = typical Node.js app")
- Instance count input
- Sleep service toggle (checkbox)
- Educational tooltips for resource recommendations

**Networking Tab (web services only):**
- Container port input
- "Expose to external traffic" toggle
- Custom domains section with "Add Custom Domain" button
- Educational tooltips for port configuration, domain setup

**Advanced Tab (all service types):**
- Health checks toggle with explanation
- Termination grace period input
- IAM Role Connection toggle
- Autoscaling toggle (moved from Resources)
- Ingress annotations (moved from Networking)
- **Cron-specific additions:**
  - "Allow concurrent execution" toggle
  - Timeout input (seconds)

**Service Card States:**
- **Default:** Clean appearance for valid configurations
- **Error:** Red border around entire card for validation errors
- **Validation:** Errors persist until resolved, appear on blur

**Validation Rules:**
- **Required:** Cron schedule for cron jobs only
- **Smart defaults:** All other fields have working defaults
- **Real-time:** Validation on blur, not on change

**Navigation:**
- Back button: "Back"
- Continue button: "Configure Optional Settings" (disabled until validation passes)

**Context Bar Output:**
- Individual service chips: [Service icon] `web-service`, [Worker icon] `worker-service`
- Overflow handling: Show individual chips then "..." for tooltip with remaining
- Error indication: [Service icon] `cron-job ⚠️` (only for validation errors)

---

### Step 4: Optional Configuration

**Content Sections:**

1. **Environment Variables:**
   - Key/value pair inputs
   - "Add row" button
   - "Copy from file" button for bulk import
   - Educational text: "Secure storage and availability across services"

2. **Sync Environment Groups:**
   - List of available environment groups
   - "Sync an env group" button
   - Educational explanation: "Shared configs with auto-redeployment when updated"

3. **Pre-Deploy Jobs:**
   - "Add a new pre-deploy job" button
   - Job configuration inputs
   - Educational examples: "Database migrations, asset compilation"

**Validation:**
- All fields optional
- No blocking validation

**Navigation:**
- Back button: "Back"
- Final button: "Deploy Application" (with deployment icon)
- Loading state: Button animates, then shows toast notification

**Context Bar Output:**
- [Env icon] `5 env vars` (if any added)
- [Group icon] `2 sync groups` (if any added)
- [Job icon] `1 pre-deploy job` (if any added)

---

## Technical Implementation Details

### Form State Management
- **Library:** React Hook Form
- **Persistence:** Client-side only until deployment
- **Validation:** Built-in rules, triggered on blur
- **Structure:** Single form spanning all steps with conditional field rendering

### API Integration Points

**GitHub Integration:**
```javascript
// Step 2: Get providers
GET /api/projects/{project_id}/integrations/git

// Step 2: Get repositories
GET /api/projects/{project_id}/gitrepos/{git_repo_id}/repos

// Step 2: Get branches
GET /api/projects/{project_id}/gitrepos/{installation_id}/repos/{kind}/{owner}/{name}/branches
```

**App Creation:**
```javascript
// Final submission
POST /api/projects/{project_id}/clusters/{cluster_id}/apps
```

### Component Architecture

**Key Components:**
- `MultiStepForm` - Main container with stepper logic
- `ContextBar` - Chip display of completed steps
- `ServiceCard` - Individual service configuration
- `ServiceDropdown` - Add service selection
- `StepNavigation` - Back/Continue buttons

**State Structure:**
```javascript
{
  currentStep: 1,
  applicationName: "",
  sourceConfig: {
    deploymentMethod: "git",
    account: null,
    repository: null,
    branch: null,
    isMonorepo: false,
    buildpack: "auto-detected",
    advancedSettings: {
      rootPath: "",
      porterYamlPath: ""
    }
  },
  services: [
    {
      id: "uuid",
      name: "web-service-1",
      type: "web",
      config: {
        startCommand: "",
        cpuCores: 0.5,
        ramMB: 512,
        instances: 1,
        port: 3000,
        // ... other service-specific config
      }
    }
  ],
  optionalConfig: {
    environmentVars: [],
    syncGroups: [],
    preDeployJobs: []
  }
}
```

### Validation Rules

**React Hook Form Validation:**
```javascript
// Application name
applicationName: {
  required: "Application name is required"
}

// Cron schedule (only for cron jobs)
cronSchedule: {
  required: "Cron schedule is required for cron jobs",
  pattern: {
    value: /^(\*|[0-5]?\d) (\*|[01]?\d|2[0-3]) (\*|[012]?\d|3[01]) (\*|[01]?\d) (\*|[0-6])$/,
    message: "Invalid cron format"
  }
}

// Resource ranges
cpuCores: {
  min: { value: 0.1, message: "Minimum 0.1 cores" },
  max: { value: 20, message: "Maximum 20 cores" }
}
```

### Educational Elements Implementation

**Tooltip System:**
- Consistent tooltip component with help icon triggers
- Positioned to avoid obscuring form fields
- Mobile-accessible (click to show, not hover-only)

**Messaging Locations:**
- Buildpack detection explanations
- Resource allocation guidance  
- Networking concept clarification
- Service type descriptions
- Advanced settings help text

### Accessibility Requirements

**Keyboard Navigation:**
- Tab order: Form fields → buttons → interactive elements
- Tab content: Automatic focus on tab selection
- Service cards: Tab through service tabs then fields within
- Skip links: Not required for this internal tool

**ARIA Labels:**
- Form sections clearly labeled
- Tab panels properly associated
- Button states clearly indicated
- Error messages associated with fields

## Final Submission Structure

**File Organization:**
```
src/
├── components/
│   ├── MultiStepForm/
│   ├── ContextBar/
│   ├── ServiceCard/
│   └── shared/
├── hooks/
│   ├── useFormData.js
│   └── useApiCalls.js
├── utils/
│   ├── validation.js
│   └── constants.js
└── types/
    └── form.types.js
```

**README Requirements:**
- Setup and installation instructions
- API endpoint configuration
- Component architecture overview
- Known limitations and future improvements
- Time constraints and incomplete features

## Success Criteria

**Functional Requirements:**
- Complete multi-step form workflow
- API integration with mock endpoints
- Client-side validation with error states
- Context bar showing completed step information
- Service configuration with all specified options

**User Experience Requirements:**
- Clear educational content throughout
- Intuitive service addition and configuration
- Responsive layouts within desktop constraints
- Professional Polish matching Porter's existing design
- Smooth transitions between steps

**Code Quality Requirements:**
- Clean, maintainable component structure
- Proper TypeScript types (if using TypeScript)
- Consistent code formatting and organization
- Appropriate error handling for API calls
- Performance considerations for form state management

This specification provides complete implementation guidance for creating a polished, production-ready Porter application deployment form.
