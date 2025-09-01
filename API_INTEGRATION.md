# API Integration Guide

## Response Format

The API service now supports both **wrapped** and **plain** response formats:

### Plain Response Format (Current)
```json
{
  "id": "123",
  "name": "Group Name",
  "description": "Group Description",
  "members": [...],
  "adminId": "user_123",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Wrapped Response Format (Also Supported)
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Group Name",
    "description": "Group Description",
    "members": [...],
    "adminId": "user_123",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Operation completed successfully"
}
```

## Error Handling

The API service handles multiple error formats:

### Error Response Examples
```json
// Plain message
{ "message": "Group not found" }

// Wrapped error
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Group not found"
  }
}

// String response
"Group not found"
```

## API Endpoints

The application expects these REST endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Groups
- `GET /groups` - List user's groups
- `POST /groups` - Create new group
- `GET /groups/{id}` - Get group details
- `POST /groups/{id}/members` - Add member to group

### Users
- `GET /users/search?q={query}` - Search users by email

## Configuration

Set the API base URL in your environment:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Null Safety & Missing Data

The application now safely handles groups without members:

### Group Data Structure
```typescript
interface Group {
  id: string;
  name: string;
  description?: string;
  members?: User[];  // Optional - can be undefined or empty
  adminId: string;
  createdAt: string;
}
```

### Safe Access Patterns
All components use null-safe access:
- `group.members?.length || 0` for member counts
- `(members || []).map(...)` for member lists
- Default to empty arrays when members are undefined

## Authentication

The API service automatically includes JWT tokens in requests:
- Token stored in `localStorage` as `auth_token`
- Automatically added to `Authorization: Bearer {token}` header
- Auto-logout on 401 responses

## Troubleshooting

### Duplicate Groups in Sidebar
If you see duplicate groups or all groups highlighted:
1. **Cause**: React Query cache corruption or duplicate API responses
2. **Fix**: The app now automatically filters duplicates and uses proper cache invalidation
3. **Manual fix**: Clear browser localStorage and refresh the page

### Group Selection Issues
- Each group must have a unique `id` field
- Group highlighting uses exact path matching: `/groups/{id}`
- The app automatically filters out groups with invalid IDs (`undefined`, `null`, or missing)
- Temporary IDs are generated for groups missing IDs: `temp-{timestamp}-{index}`
- Check browser console for any API errors

### URL Shows "undefined"
This happens when groups don't have valid IDs:
1. **API Issue**: Your backend is not returning the `id` field for groups
2. **Fix**: The app now generates fallback IDs and filters invalid groups
3. **Solution**: Ensure your API returns proper `id` fields for all group objects

### "Group not found" Error
When clicking on groups shows "Group not found":
1. **Cause**: Groups with temporary IDs can't be found via API calls
2. **Fix**: The app now uses cache-first lookup for group details
3. **Behavior**: Groups with temporary IDs work from cached data
4. **Solution**: Ensure your API returns consistent group IDs

### Advanced Deduplication
The app now handles multiple data quality issues:
- **ID-based duplicates**: Same ID, different data
- **Name-based duplicates**: Different IDs, same name  
- **Data completeness**: Prefers groups with more member data
- **Real vs temporary IDs**: Always prefers real IDs over temporary ones

### Cache Management
The app includes cache utilities:
```typescript
const { clearCache } = useGroups();
// Call clearCache() to reset groups data
```
