'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Users, Plus, Edit2, Trash2, Search, X, Eye, EyeOff, AlertTriangle, Info, Calendar, Mail, User as UserIcon, Shield, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

interface User {
	id: number;
	username: string;
	email: string;
	role: string; // Can be 'ADMIN' | 'CONVENER' | 'STAFF' from DB
	isActive: boolean;
	createdAt: string;
	modifiedAt?: string;
	profilePicture?: string;
	staff?: {
		id: number;
		name: string;
		designation: string;
		mobileNo?: string;
		emailAddress: string;
		department?: {
			id: number;
			departmentName: string;
		};
		createdAt: string;
	};
}

interface UserFormData {
	username: string;
	email: string;
	password: string;
	role: 'admin' | 'convener' | 'staff';
	isActive: boolean;
}

export default function UsersManagement() {
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [formData, setFormData] = useState<UserFormData>({
		username: '',
		email: '',
		password: '',
		role: 'staff',
		isActive: true,
	});
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!authLoading && user) {
			fetchUsers();
		}
	}, [authLoading, user]);

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/users');
			const result = await response.json();
			if (result.success) {
				setUsers(result.data.data || []);
			}
		} catch (error) {
			console.error('Failed to fetch users:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (user?: User) => {
		if (user) {
			setEditingUser(user);
			setFormData({
				username: user.username,
				email: user.email,
				password: '',
				role: user.role.toLowerCase() as 'admin' | 'convener' | 'staff',
				isActive: user.isActive,
			});
		} else {
			setEditingUser(null);
			setFormData({
				username: '',
				email: '',
				password: '',
				role: 'staff',
				isActive: true,
			});
		}
		setFormErrors({});
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingUser(null);
		setFormData({
			username: '',
			email: '',
			password: '',
			role: 'staff',
			isActive: true,
		});
		setFormErrors({});
		setShowPassword(false);
	};

	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		if (!formData.username.trim()) {
			errors.username = 'Username is required';
		}

		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Invalid email format';
		}

		if (!editingUser && !formData.password) {
			errors.password = 'Password is required';
		} else if (formData.password && formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
			const method = editingUser ? 'PUT' : 'POST';

			const payload: any = {
				username: formData.username,
				email: formData.email,
				role: formData.role.toUpperCase(), // Convert to uppercase for database enum
				isActive: formData.isActive,
			};

			if (formData.password) {
				payload.password = formData.password;
			}

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				await fetchUsers();
				handleCloseModal();
			} else {
				setFormErrors({ submit: result.error || result.message || 'Failed to save user' });
			}
		} catch (error) {
			console.error('Error saving user:', error);
			setFormErrors({ submit: 'An error occurred while saving the user' });
		}
	};

	const handleOpenDeleteModal = (userId: number, username: string) => {
		setUserToDelete({ id: userId, username });
		setDeleteConfirmText('');
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setUserToDelete(null);
		setDeleteConfirmText('');
	};

	const handleConfirmDelete = async () => {
		if (!userToDelete || deleteConfirmText !== 'DELETE') {
			return;
		}

		try {
			const response = await fetch(`/api/users/${userToDelete.id}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
			await Swal.fire({
				icon: 'success',
				title: 'User Deleted',
				text: `User "${userToDelete.username}" has been permanently deleted`,
				timer: 2000,
				showConfirmButton: false,
			});
			handleCloseDeleteModal();
			await fetchUsers();
		} else {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: result.error || result.message || 'Failed to delete user',
			});
		}
	} catch (error) {
			console.error('Error deleting user:', error);
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An unexpected error occurred while deleting the user',
			});
		}
	};

	const handleViewUser = async (userId: number) => {
		try {
			const response = await fetch(`/api/users/${userId}`);
			const result = await response.json();
			if (result.success) {
				setSelectedUser(result.data);
				setShowDetailModal(true);
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	};

	const handleToggleStatus = async (userId: number, currentStatus: boolean, username: string) => {
		const action = currentStatus ? 'deactivate' : 'activate';
		const confirmTitle = currentStatus ? 'Deactivate User?' : 'Activate User?';
		const confirmText = currentStatus
			? `Are you sure you want to deactivate "${username}"? Deactivated users cannot log in but their data is preserved. You can reactivate them later.`
			: `Are you sure you want to activate "${username}"? Activated users will be able to log in to the system.`;
		
		const result = await Swal.fire({
			title: confirmTitle,
			text: confirmText,
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: currentStatus ? '#ef4444' : '#10b981',
			cancelButtonColor: '#6b7280',
			confirmButtonText: currentStatus ? 'Yes, deactivate' : 'Yes, activate',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			const response = await fetch(`/api/users/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isActive: !currentStatus }),
			});

			const result = await response.json();

			if (result.success) {
				await Swal.fire({
					icon: 'success',
					title: 'Success',
					text: `User "${username}" has been ${action}d successfully`,
					timer: 2000,
					showConfirmButton: false,
				});
				await fetchUsers();
			} else {
				await Swal.fire({
					icon: 'error',
					title: 'Error',
					text: result.message || `Failed to ${action} user`,
				});
			}
		} catch (error) {
			console.error('Error updating user status:', error);
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An unexpected error occurred while updating user status',
			});
		}
	};

	const filteredUsers = users.filter((user) => {
		// Filter by status
		if (statusFilter === 'active' && !user.isActive) return false;
		if (statusFilter === 'inactive' && user.isActive) return false;

		// Filter by search term
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			return (
				user.username.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower) ||
				user.role.toLowerCase().includes(searchLower) ||
				user.staff?.name.toLowerCase().includes(searchLower)
			);
		}

		return true;
	});

	if (authLoading || loading) {
		return (
			<DashboardLayout role="admin">
				<div className="flex items-center justify-center h-full">
					<div
						style={{ animation: 'spin 1s linear infinite' }}
						className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
					/>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="admin">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
							<Users className="h-8 w-8" />
							User Management
						</h1>
						<p className="text-gray-600 mt-2">Manage all system users and their roles</p>
					</div>
					<button
						onClick={() => handleOpenModal()}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
					>
						<Plus size={20} />
						Add User
					</button>
				</div>

				{/* Success Message */}
				{successMessage && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
						<span>{successMessage}</span>
						<button onClick={() => setSuccessMessage('')} className="text-green-700 hover:text-green-900">
							<X size={18} />
						</button>
					</div>
				)}

				{/* Search and Filter */}
				<div className="bg-white p-4 rounded-lg shadow">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search users by username, email, or role..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setStatusFilter('all')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'all'
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								All
							</button>
							<button
								onClick={() => setStatusFilter('active')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'active'
										? 'bg-green-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								Active
							</button>
							<button
								onClick={() => setStatusFilter('inactive')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'inactive'
										? 'bg-red-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								Inactive
							</button>
						</div>
					</div>
				</div>

				{/* Users Table */}
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Role
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Created At
									</th>
									<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredUsers.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-8 text-center text-gray-500">
											No users found
										</td>
									</tr>
								) : (
									filteredUsers.map((user) => (
								<tr key={user.id} className={`hover:bg-gray-50 ${!user.isActive ? 'bg-gray-100 opacity-75' : ''}`}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-medium text-gray-900">{user.username}</div>
													{user.staff?.name && (
														<div className="text-sm text-gray-500">{user.staff.name}</div>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{user.email}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.role.toUpperCase() === 'ADMIN'
														? 'bg-blue-100 text-blue-800'
														: user.role.toUpperCase() === 'CONVENER'
														? 'bg-green-100 text-green-800'
														: 'bg-purple-100 text-purple-800'
												}`}
											>
												{user.role.toLowerCase()}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<button
												onClick={() => handleToggleStatus(user.id, user.isActive, user.username)}
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition ${
													user.isActive
														? 'bg-green-100 text-green-800'
														: 'bg-red-100 text-red-800'
												}`}
												title={user.isActive ? 'Click to deactivate' : 'Click to activate'}
												>
													{user.isActive ? 'Active' : 'Inactive'}
												</button>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(user.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
												<div className="flex items-center justify-center gap-2">
													<button
													onClick={() => handleViewUser(user.id)}
													className="text-indigo-600 hover:text-indigo-900 transition"
													title="View user details"
												>
													<Eye size={18} />
												</button>
												<button
													onClick={() => handleOpenModal(user)}
													className="text-blue-600 hover:text-blue-900 transition"
													title="Edit user"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleOpenDeleteModal(user.id, user.username)}
													className="text-red-600 hover:text-red-900 transition"
													title="Permanently delete user"
												>
													<Trash2 size={18} />
												</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* User Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="text-sm text-gray-600">Total Users</div>
						<div className="text-3xl font-bold text-gray-900 mt-2">{users.length}</div>					<div className="text-xs text-gray-500 mt-1">
						{users.filter((u) => u.isActive).length} active · {users.filter((u) => !u.isActive).length} inactive
					</div>					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="text-sm text-gray-600">Admins</div>
						<div className="text-3xl font-bold text-blue-600 mt-2">
						{users.filter((u) => u.role.toUpperCase() === 'ADMIN').length}
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<div className="text-sm text-gray-600">Conveners</div>
					<div className="text-3xl font-bold text-green-600 mt-2">
						{users.filter((u) => u.role.toUpperCase() === 'CONVENER').length}
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<div className="text-sm text-gray-600">Staff</div>
					<div className="text-3xl font-bold text-purple-600 mt-2">
						{users.filter((u) => u.role.toUpperCase() === 'STAFF').length}
						</div>
					</div>
				</div>
			</div>

			{/* Add/Edit User Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="flex justify-between items-center p-6 border-b border-gray-200">
							<h2 className="text-2xl font-bold text-gray-900">
								{editingUser ? 'Edit User' : 'Add New User'}
							</h2>
							<button
								onClick={handleCloseModal}
								className="text-gray-400 hover:text-gray-600"
							>
								<X size={24} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							{formErrors.submit && (
								<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
									{formErrors.submit}
								</div>
							)}

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Username *
								</label>
								<input
									type="text"
									value={formData.username}
									onChange={(e) =>
										setFormData({ ...formData, username: e.target.value })
									}
									autoComplete="username"
									className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										formErrors.username ? 'border-red-500' : 'border-gray-300'
									}`}
								/>
								{formErrors.username && (
									<p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email *
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									autoComplete="email"
									className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										formErrors.email ? 'border-red-500' : 'border-gray-300'
									}`}
								/>
								{formErrors.email && (
									<p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password {!editingUser && '*'}
								</label>
								<div className="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										autoComplete="new-password"
										placeholder={editingUser ? 'Leave blank to keep current password' : ''}
										className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											formErrors.password ? 'border-red-500' : 'border-gray-300'
										}`}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{formErrors.password && (
									<p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Role *
								</label>
								<select
									value={formData.role}
									onChange={(e) =>
										setFormData({
											...formData,
											role: e.target.value as 'admin' | 'convener' | 'staff',
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="staff">Staff</option>
									<option value="convener">Convener</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="isActive"
									checked={formData.isActive}
									onChange={(e) =>
										setFormData({ ...formData, isActive: e.target.checked })
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
									Active
								</label>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
								>
									{editingUser ? 'Update User' : 'Create User'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && userToDelete && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="p-6">
							<div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
								<AlertTriangle className="h-6 w-6 text-red-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 text-center mb-2">
								⚠️ PERMANENT DELETE
							</h3>
							<p className="text-gray-600 text-center mb-4">
								Are you sure you want to permanently delete user <span className="font-semibold">"{userToDelete.username}"</span>?
							</p>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
								<p className="text-sm text-red-800">
									<strong>Warning:</strong> This action CANNOT be undone. All user data will be permanently removed from the system.
								</p>
							</div>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Type <span className="font-bold text-red-600">DELETE</span> to confirm:
								</label>
								<input
									type="text"
									value={deleteConfirmText}
									onChange={(e) => setDeleteConfirmText(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Type DELETE"
									autoFocus
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={handleCloseDeleteModal}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleConfirmDelete}
									disabled={deleteConfirmText !== 'DELETE'}
									className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
										deleteConfirmText === 'DELETE'
											? 'bg-red-600 hover:bg-red-700'
											: 'bg-gray-400 cursor-not-allowed'
									}`}
								>
									Delete Permanently
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* User Detail Modal */}
			{showDetailModal && selectedUser && (
				<div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto scrollbar-hide">
						<div className="sticky top-0 bg-white flex justify-between items-center px-5 py-4 border-b border-gray-200">
							<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
								<Info className="h-5 w-5 text-blue-600" />
								User Details
							</h2>
							<button
								onClick={() => setShowDetailModal(false)}
								className="text-gray-400 hover:text-gray-600 transition"
							>
								<X size={20} />
							</button>
						</div>

						<div className="p-5 space-y-4">
							{/* Profile Picture and Basic Info */}
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0">
									{selectedUser.profilePicture ? (
										<img
											src={selectedUser.profilePicture}
											alt={selectedUser.username}
											className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
										/>
									) : (
										<div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
											<UserIcon className="h-10 w-10 text-white" />
										</div>
									)}
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900">{selectedUser.username}</h3>
									<p className="text-gray-600 text-sm mt-1">{selectedUser.email}</p>
									<div className="flex items-center gap-2 mt-2">
										<span
											className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
												selectedUser.role.toUpperCase() === 'ADMIN'
													? 'bg-blue-100 text-blue-800'
													: selectedUser.role.toUpperCase() === 'CONVENER'
													? 'bg-green-100 text-green-800'
													: 'bg-purple-100 text-purple-800'
											}`}
										>
											<Shield className="h-3 w-3 mr-1" />
											{selectedUser.role.toLowerCase()}
										</span>
										<span
											className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
												selectedUser.isActive
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}
										>
											<Activity className="h-3 w-3 mr-1" />
											{selectedUser.isActive ? 'Active' : 'Inactive'}
										</span>
									</div>
								</div>
							</div>

							{/* Account Information */}
							<div className="bg-gray-50 rounded-lg p-3.5">
								<h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
									<UserIcon className="h-4 w-4 text-gray-600" />
									Account Information
								</h4>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<p className="text-xs text-gray-600">User ID</p>
										<p className="text-sm font-medium text-gray-900">#{selectedUser.id}</p>
									</div>
									<div>
										<p className="text-xs text-gray-600">Username</p>
										<p className="text-sm font-medium text-gray-900">{selectedUser.username}</p>
									</div>
									<div>
										<p className="text-xs text-gray-600">Email Address</p>
										<p className="text-sm font-medium text-gray-900 flex items-center gap-1">
											<Mail className="h-3 w-3 text-gray-500" />
											{selectedUser.email}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-600">Role</p>
										<p className="text-sm font-medium text-gray-900 capitalize">{selectedUser.role.toLowerCase()}</p>
									</div>
									<div>
										<p className="text-xs text-gray-600">Account Status</p>
										<p className={`text-sm font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
											{selectedUser.isActive ? 'Active' : 'Inactive'}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-600">Created At</p>
										<p className="text-sm font-medium text-gray-900 flex items-center gap-1">
											<Calendar className="h-3 w-3 text-gray-500" />
											{new Date(selectedUser.createdAt).toLocaleString()}
										</p>
									</div>
									{selectedUser.modifiedAt && (
										<div>
											<p className="text-xs text-gray-600">Last Modified</p>
											<p className="text-sm font-medium text-gray-900 flex items-center gap-1">
												<Calendar className="h-3 w-3 text-gray-500" />
												{new Date(selectedUser.modifiedAt).toLocaleString()}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Staff Information */}
							{selectedUser.staff && (
								<div className="bg-blue-50 rounded-lg p-3.5">
									<h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
										<UserIcon className="h-4 w-4 text-blue-600" />
										Staff Information
									</h4>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<p className="text-xs text-gray-600">Staff ID</p>
											<p className="text-sm font-medium text-gray-900">#{selectedUser.staff.id}</p>
										</div>
										<div>
											<p className="text-xs text-gray-600">Full Name</p>
											<p className="text-sm font-medium text-gray-900">{selectedUser.staff.name}</p>
										</div>
										{selectedUser.staff.designation && (
											<div>
												<p className="text-xs text-gray-600">Designation</p>
												<p className="text-sm font-medium text-gray-900">{selectedUser.staff.designation}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-600">Email</p>
											<p className="text-sm font-medium text-gray-900">{selectedUser.staff.emailAddress}</p>
										</div>
										{selectedUser.staff.mobileNo && (
											<div>
												<p className="text-xs text-gray-600">Mobile Number</p>
												<p className="text-sm font-medium text-gray-900">{selectedUser.staff.mobileNo}</p>
											</div>
										)}
										{selectedUser.staff.department && (
											<div>
												<p className="text-xs text-gray-600">Department</p>
												<p className="text-sm font-medium text-gray-900">{selectedUser.staff.department.departmentName}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-600">Staff Since</p>
											<p className="text-sm font-medium text-gray-900">
												{new Date(selectedUser.staff.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-2.5 pt-3 border-t border-gray-200">
								<button
									type="button"
									onClick={() => {
										setShowDetailModal(false);
										handleOpenModal(selectedUser);
									}}
									className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
								>
									<Edit2 size={16} />
									Edit User
								</button>
								<button
									type="button"
									onClick={() => setShowDetailModal(false)}
									className="flex-1 px-4 py-2 border border-gray-300 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}
