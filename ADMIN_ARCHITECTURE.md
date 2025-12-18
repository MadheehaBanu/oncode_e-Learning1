# Admin Settings Module - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL                                 │
│                  (/admin/settings)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              AdminSettings.js (Tab Navigation)                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │ Banners  │Faculties │Prof Aff  │Foreign   │Programmes│      │
│  │          │          │          │Aff       │          │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┬──────────────┬──────────────┐
                ▼             ▼             ▼              ▼              ▼
        ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Banner    │ │  Faculty   │ │Prof Aff  │ │Foreign   │ │Programmes│
        │Management  │ │Management  │ │Management│ │Aff Mgmt  │ │Management│
        └────────────┘ └────────────┘ └──────────┘ └──────────┘ └──────────┘
                │             │             │              │              │
                └─────────────┼─────────────┼──────────────┼──────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────────┐      ┌──────────────────┐
        │ Firebase Storage │      │ Firestore        │
        │ (Images)         │      │ (Metadata)       │
        │                  │      │                  │
        │ banners/         │      │ siteContent/     │
        │ faculties/       │      │ faculties        │
        │ prof-aff/        │      │ professionalAff  │
        │ foreign-aff/     │      │ foreignAff       │
        │ programmes/      │      │ programmes       │
        └──────────────────┘      └──────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────────┐      ┌──────────────────┐
        │ Custom Hooks     │      │ Frontend Pages   │
        │                  │      │                  │
        │ useContent()     │      │ Home.js          │
        │ useAffiliations()│      │ ProfessionalAff  │
        │ useProgrammes()  │      │ ForeignAff       │
        │                  │      │ Newprogramme.js  │
        └──────────────────┘      └──────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌──────────────────┐
                    │  FRONTEND UI     │
                    │  (User Visible)  │
                    └──────────────────┘
```

## Data Flow Diagram

### Adding Content (Admin → Frontend)

```
Admin fills form
        │
        ▼
Validate input
        │
        ▼
Upload image to Firebase Storage
        │
        ▼
Get image URL
        │
        ▼
Save metadata to Firestore
        │
        ▼
Firestore listener triggers
        │
        ▼
Custom hook updates state
        │
        ▼
Frontend component re-renders
        │
        ▼
User sees new content
```

### Fetching Content (Frontend)

```
Component mounts
        │
        ▼
Custom hook initializes
        │
        ▼
Firestore listener attached
        │
        ▼
Query Firestore collection
        │
        ▼
Firestore returns documents
        │
        ▼
Hook updates state
        │
        ▼
Component re-renders with data
        │
        ▼
Images loaded from Storage URLs
        │
        ▼
User sees content
```

## Component Hierarchy

```
AdminSettings (Main Page)
├── BannerManagement
│   └── Form + Preview
├── FacultyManagement
│   ├── Form
│   └── Faculty Cards Grid
├── ProfessionalAffiliationsManagement
│   ├── Form
│   └── Affiliation Cards Grid
├── ForeignAffiliationsManagement
│   ├── Form
│   └── Affiliation Cards Grid
└── ProgrammesManagement
    ├── Form
    └── Programme Cards Grid
```

## Firestore Data Structure

```
Firestore Database
│
├── siteContent (Collection)
│   └── banners (Document)
│       └── banners: [
│           {
│             id: 1,
│             title: "...",
│             subtitle: "...",
│             buttonText: "...",
│             image: "https://...",
│             order: 1
│           }
│         ]
│
├── faculties (Collection)
│   ├── doc1 (Document)
│   │   ├── name: "School of Business"
│   │   ├── description: "..."
│   │   ├── icon: "💼"
│   │   ├── image: "https://..."
│   │   └── order: 1
│   └── doc2 (Document)
│       └── ...
│
├── professionalAffiliations (Collection)
│   ├── doc1 (Document)
│   │   ├── title: "..."
│   │   ├── description: "..."
│   │   └── logo: "https://..."
│   └── doc2 (Document)
│       └── ...
│
├── foreignAffiliations (Collection)
│   ├── doc1 (Document)
│   │   ├── name: "..."
│   │   ├── country: "..."
│   │   ├── description: "..."
│   │   └── logo: "https://..."
│   └── doc2 (Document)
│       └── ...
│
└── programmes (Collection)
    ├── doc1 (Document)
    │   ├── title: "..."
    │   ├── description: "..."
    │   ├── category: "..."
    │   ├── duration: "..."
    │   └── image: "https://..."
    └── doc2 (Document)
        └── ...
```

## Firebase Storage Structure

```
Firebase Storage Bucket
│
├── banners/
│   ├── 1704067200000_banner1.jpg
│   └── 1704067300000_banner2.jpg
│
├── faculties/
│   ├── 1704067400000_business.jpg
│   ├── 1704067500000_tech.jpg
│   └── 1704067600000_design.jpg
│
├── professional-affiliations/
│   ├── 1704067700000_logo1.png
│   └── 1704067800000_logo2.png
│
├── foreign-affiliations/
│   ├── 1704067900000_logo1.png
│   └── 1704068000000_logo2.png
│
└── programmes/
    ├── 1704068100000_prog1.jpg
    └── 1704068200000_prog2.jpg
```

## State Management Flow

```
Admin Component State
│
├── form (Current form data)
├── editId (Currently editing item)
├── imageFile (Selected image file)
├── uploading (Upload in progress)
│
└── Firestore Listener
    │
    ├── data (All items from collection)
    ├── loading (Initial load state)
    └── error (Any errors)
```

## Security Flow

```
User Action (Admin)
        │
        ▼
Check Authentication
        │
        ├─ Not authenticated → Redirect to login
        │
        └─ Authenticated → Check role
                │
                ├─ Not admin → Redirect to dashboard
                │
                └─ Admin → Allow access
                        │
                        ▼
                    Firestore Security Rules
                        │
                        ├─ Read → Allow (public)
                        │
                        └─ Write → Check admin token
                                │
                                ├─ Valid admin → Allow
                                │
                                └─ Not admin → Deny
```

## Real-time Update Flow

```
Admin saves data
        │
        ▼
Data written to Firestore
        │
        ▼
Firestore triggers onSnapshot listener
        │
        ▼
All connected clients receive update
        │
        ├─ Admin panel updates immediately
        │
        └─ Frontend pages update in real-time
                │
                ▼
            Users see changes instantly
```

## Error Handling Flow

```
Operation initiated
        │
        ▼
Try block
        │
        ├─ Success → Update UI
        │
        └─ Error → Catch block
                │
                ▼
            Log error to console
                │
                ▼
            Set error state
                │
                ▼
            Display error message to user
                │
                ▼
            User can retry
```

## Performance Considerations

```
Image Upload Optimization
├── File size validation
├── Compression (optional)
└── Async upload with progress

Firestore Query Optimization
├── Real-time listeners (onSnapshot)
├── Indexed queries
└── Pagination (future enhancement)

Frontend Rendering
├── Lazy loading images
├── Memoization of components
└── Conditional rendering
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Real-time updates
- ✅ Security
- ✅ Performance
- ✅ Maintainability
