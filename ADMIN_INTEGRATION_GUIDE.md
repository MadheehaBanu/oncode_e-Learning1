# Admin Settings Module - Integration Guide

## Overview
This guide explains how to integrate the Admin Settings Module with your backend API (optional) and how to extend it with additional features.

## Current Implementation

The Admin Settings Module uses **Firebase Firestore** and **Firebase Storage** directly from the frontend. This is a serverless approach that requires no backend API.

### Advantages
✅ No backend server needed
✅ Real-time updates
✅ Automatic scaling
✅ Built-in security rules
✅ Reduced latency

### When to Use Backend API

Consider adding a backend API if you need:
- Custom business logic
- Data validation beyond client-side
- Audit logging
- Email notifications
- Scheduled tasks
- Complex queries

## Backend Integration (Optional)

### Step 1: Create Backend Routes

If you want to add backend API endpoints, create these routes in your Node.js backend:

```javascript
// backend/routes/admin.js

const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Banners
router.post('/banners', adminAuth, async (req, res) => {
  // Save banners to Firestore
});

router.get('/banners', async (req, res) => {
  // Get banners from Firestore
});

// Faculties
router.post('/faculties', adminAuth, async (req, res) => {
  // Create faculty
});

router.put('/faculties/:id', adminAuth, async (req, res) => {
  // Update faculty
});

router.delete('/faculties/:id', adminAuth, async (req, res) => {
  // Delete faculty
});

// Similar routes for other content types...

module.exports = router;
```

### Step 2: Update Frontend to Use API

Modify the management components to use API endpoints:

```javascript
// Example: FacultyManagement.js with API

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);
  try {
    let imageUrl = form.image;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, 'faculties');
    }

    const data = { ...form, image: imageUrl };

    if (editId) {
      await axios.put(`/api/admin/faculties/${editId}`, data);
    } else {
      await axios.post('/api/admin/faculties', data);
    }

    // Refresh data
    setForm({ name: '', description: '', icon: '', image: '', order: 1 });
    setImageFile(null);
    setEditId(null);
  } catch (err) {
    console.error('Error saving faculty:', err);
  } finally {
    setUploading(false);
  }
};
```

## Extending the Module

### Add New Content Type

#### Step 1: Create Management Component

```javascript
// frontend/src/components/admin/NewContentManagement.js

import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '../../utils/firebaseStorage';
import { useFirestore } from '../../hooks/useFirestore';

const NewContentManagement = () => {
  const { data: items, loading } = useFirestore('newContent');
  const [form, setForm] = useState({ title: '', description: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'new-content');
      }

      const data = { title: form.title, description: form.description, image: imageUrl };

      if (editId) {
        await updateDoc(doc(db, 'newContent', editId), data);
      } else {
        await addDoc(collection(db, 'newContent'), data);
      }

      setForm({ title: '', description: '', image: '' });
      setImageFile(null);
      setEditId(null);
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setUploading(false);
    }
  };

  // ... rest of component
};

export default NewContentManagement;
```

#### Step 2: Add to AdminSettings

```javascript
// frontend/src/pages/admin/AdminSettings.js

import NewContentManagement from '../../components/admin/NewContentManagement';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('banners');

  const tabs = [
    // ... existing tabs
    { id: 'newcontent', label: 'New Content', component: NewContentManagement }
  ];

  // ... rest of component
};
```

#### Step 3: Create Frontend Hook

```javascript
// frontend/src/hooks/useNewContent.js

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const useNewContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'newContent'), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching content:', err);
        setError(err.message);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};
```

#### Step 4: Update Frontend Component

```javascript
// frontend/src/components/NewContentDisplay.js

import React from 'react';
import { useNewContent } from '../hooks/useNewContent';

const NewContentDisplay = () => {
  const { data: items, loading } = useNewContent();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.image && <img src={item.image} alt={item.title} />}
        </div>
      ))}
    </div>
  );
};

export default NewContentDisplay;
```

## Advanced Features

### 1. Audit Logging

Track all admin actions:

```javascript
// backend/middleware/auditLog.js

const logAdminAction = async (userId, action, collection, documentId, changes) => {
  await db.collection('auditLogs').add({
    userId,
    action,
    collection,
    documentId,
    changes,
    timestamp: new Date(),
    ipAddress: req.ip
  });
};
```

### 2. Bulk Operations

Add bulk import/export:

```javascript
// frontend/src/components/admin/BulkOperations.js

const handleBulkImport = async (file) => {
  const data = await parseCSV(file);
  for (const item of data) {
    await addDoc(collection(db, 'faculties'), item);
  }
};

const handleBulkExport = async () => {
  const snapshot = await getDocs(collection(db, 'faculties'));
  const data = snapshot.docs.map(doc => doc.data());
  downloadCSV(data, 'faculties.csv');
};
```

### 3. Scheduled Tasks

Send notifications when content is updated:

```javascript
// backend/functions/notifyContentUpdate.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.notifyContentUpdate = functions.firestore
  .document('faculties/{docId}')
  .onWrite(async (change, context) => {
    // Send email notification
    // Update cache
    // Trigger webhooks
  });
```

### 4. Content Versioning

Keep history of changes:

```javascript
// backend/middleware/versioning.js

const saveVersion = async (collection, docId, data) => {
  await db.collection(`${collection}_versions`).add({
    docId,
    data,
    timestamp: new Date(),
    version: await getNextVersion(collection, docId)
  });
};
```

### 5. Scheduled Publishing

Schedule content to go live at specific times:

```javascript
// frontend/src/components/admin/ScheduledPublishing.js

const [publishDate, setPublishDate] = useState(null);

const handleSchedulePublish = async () => {
  await updateDoc(doc(db, 'faculties', editId), {
    ...form,
    publishDate,
    status: 'scheduled'
  });
};
```

## Performance Optimization

### 1. Image Optimization

```javascript
// frontend/src/utils/imageOptimization.js

import imageCompression from 'browser-image-compression';

export const optimizeImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
};
```

### 2. Pagination

```javascript
// frontend/src/hooks/usePaginatedContent.js

export const usePaginatedContent = (collectionName, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      limit(pageSize * page)
    );
    // ... fetch logic
  }, [page]);

  return { data, page, setPage, hasMore };
};
```

### 3. Caching

```javascript
// frontend/src/utils/cache.js

const cache = new Map();

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};
```

## Testing

### Unit Tests

```javascript
// frontend/src/components/admin/__tests__/FacultyManagement.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import FacultyManagement from '../FacultyManagement';

describe('FacultyManagement', () => {
  test('renders form', () => {
    render(<FacultyManagement />);
    expect(screen.getByPlaceholderText('Faculty Name')).toBeInTheDocument();
  });

  test('submits form', async () => {
    render(<FacultyManagement />);
    // ... test logic
  });
});
```

### Integration Tests

```javascript
// Test with Firebase Emulator
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');

describe('Admin Settings', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project'
    });
  });

  test('admin can write to faculties', async () => {
    // ... test logic
  });
});
```

## Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Backend Deployment (if using API)

```bash
# Deploy to Cloud Functions
firebase deploy --only functions

# Or deploy to Cloud Run
gcloud run deploy admin-api --source .
```

## Monitoring

### Firebase Console
- Monitor Firestore usage
- Check Storage usage
- Review security rules violations
- Monitor function execution

### Custom Monitoring

```javascript
// frontend/src/utils/monitoring.js

export const trackAdminAction = (action, metadata) => {
  analytics.logEvent('admin_action', {
    action,
    ...metadata,
    timestamp: new Date()
  });
};
```

---

This integration guide provides everything needed to extend and optimize the Admin Settings Module for production use.
