# Admin User Management

## Making a User Admin

To promote a user to administrator:

```bash
cd backend
python make_admin.py user@example.com
```

Replace `user@example.com` with the email of the user you want to promote.

## Admin Features

Admin users have access to the **Administration** page in the sidebar which includes:

- **User List**: View all registered users with pagination and search
- **User Statistics**: View detailed stats for each user:
  - Number of invoices created
  - Total revenue generated
  - Number of clients, products, and expenses
  - Account creation date
  
- **User Management Actions**:
  - ✅ **Activate/Deactivate** users
  - 🔑 **Promote/Demote** admin privileges
  - 📊 **View detailed statistics** per user
  - 🗑️ **Delete users** (and all their data)

## Security Features

- Admins cannot deactivate or delete their own account
- Admins cannot remove their own admin privileges
- All admin actions are protected by role-based access control
- Non-admin users cannot access admin routes (403 Forbidden)

## Database Changes

The migration adds a `role` column to the `users` table:
- Default value: `'user'`
- Possible values: `'user'` or `'admin'`

## API Endpoints

All admin endpoints require authentication with an admin role:

- `GET /api/admin/users/` - List all users (paginated)
- `GET /api/admin/users/{id}/stats` - Get user statistics
- `PATCH /api/admin/users/{id}/toggle-active` - Activate/deactivate user
- `PATCH /api/admin/users/{id}/make-admin` - Promote to admin
- `PATCH /api/admin/users/{id}/remove-admin` - Demote from admin
- `DELETE /api/admin/users/{id}` - Delete user and all data
