import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
import {
  Vote,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Mail,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import type { Faculty, Department } from '../types';

interface FormData {
  studentId: string;
  facultyId: string;
  departmentId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    facultyId: '',
    departmentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadFaculties();
  }, []);

  useEffect(() => {
    if (formData.facultyId) {
      loadDepartments(formData.facultyId);
    } else {
      setDepartments([]);
    }
  }, [formData.facultyId]);

  async function loadFaculties() {
    try {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
        .order('name');

      if (!error && data) {
        setFaculties(data);
      }
    } finally {
      setIsLoadingData(false);
    }
  }

  async function loadDepartments(facultyId: string) {
    const { data } = await supabase
      .from('departments')
      .select('*')
      .eq('faculty_id', facultyId)
      .order('name');

    if (data) {
      setDepartments(data);
    }
  }

  async function verifyStudent() {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    if (!formData.facultyId) {
      newErrors.facultyId = 'Please select a faculty';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a department';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data: student, error } = await supabase
        .from('student_records')
        .select('*, faculties!student_records_faculty_id_fkey(name), departments!student_records_department_id_fkey(name)')
        .eq('student_id', formData.studentId)
        .eq('faculty_id', formData.facultyId)
        .eq('department_id', formData.departmentId)
        .eq('status', 'active')
        .single();

      if (error || !student) {
        setErrors({ studentId: 'Student record not found. Please verify your details.' });
        return;
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('student_record_id', student.id)
        .single();

      if (existingUser) {
        setErrors({ studentId: 'This student ID is already registered. Please log in.' });
        return;
      }

      setStudentName(student.full_name);
      setFormData((prev) => ({ ...prev, email: student.email }));
      setStep(2);
    } catch {
      setErrors({ studentId: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  function validatePassword(password: string): string | null {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include a special character';
    return null;
  }

  async function handleRegister() {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.startsWith('032') || !formData.email.includes('@')) {
<<<<<<< HEAD
      newErrors.email = 'Please use your university email (e.g., 032xxxx@university.edu)';
=======
      newErrors.email = 'Please use your university email (e.g., 032xxxx@htu.edu.gh)';
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data: studentRecord } = await supabase
        .from('student_records')
        .select('id, email')
        .eq('student_id', formData.studentId)
        .single();

      if (!studentRecord || studentRecord.email !== formData.email) {
        setErrors({ email: 'Email does not match our student records' });
        return;
      }

      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
<<<<<<< HEAD
=======
          data: {
            email_confirm: true
          }
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
        },
      });

      if (signUpError) {
        setErrors({ form: signUpError.message });
        return;
      }

      if (authUser) {
        const { error: insertError } = await supabase.from('users').insert({
          id: authUser.id,
          email: formData.email,
          password_hash: '',
          role: 'student',
          full_name: studentName,
          student_record_id: studentRecord.id,
          faculty_id: formData.facultyId,
          department_id: formData.departmentId,
<<<<<<< HEAD
          is_email_verified: false,
=======
          is_email_verified: true,
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
          is_face_enrolled: false,
        });

        if (insertError) {
          setErrors({ form: 'Failed to create account. Please try again.' });
          return;
        }

<<<<<<< HEAD
        setStep(3);
=======
        // Auto sign-in after registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          // Redirect to login if auto sign-in fails
          navigate('/login');
          return;
        }

        // Redirect to face enrollment
        navigate('/face-enrollment');
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
      }
    } catch {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Vote className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-gray-900">UEVS</span>
              <p className="text-xs text-gray-500">Electronic Voting System</p>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-600">Create your account to participate in university elections</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {[
              { num: 1, label: 'Academic Info' },
              { num: 2, label: 'Account Setup' },
              { num: 3, label: 'Verify Email' },
            ].map((s, idx) => (
              <div key={s.num} className="flex-1 flex flex-col items-center relative">
                {idx < 2 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-xs mt-2 text-gray-600 hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          {errors.form && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errors.form}</p>
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Academic Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-xl border ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    placeholder="Enter your student ID"
                  />
                  {errors.studentId && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.studentId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty
                  </label>
                  <div className="relative">
                    <select
                      id="faculty"
                      value={formData.facultyId}
                      onChange={(e) => setFormData({ ...formData, facultyId: e.target.value, departmentId: '' })}
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.facultyId ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none`}
                    >
                      <option value="">Select your faculty</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.facultyId && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.facultyId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      id="department"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      disabled={!formData.facultyId}
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.departmentId ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select your department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.departmentId && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.departmentId}</p>
                  )}
                </div>

                <button
                  onClick={verifyStudent}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors shadow-md mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Student Verified</p>
                  <p className="text-sm text-green-700">{studentName}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Account Setup
              </h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
<<<<<<< HEAD
                      placeholder="032xxxx@university.edu"
=======
                      placeholder="032xxxx@htu.edu.gh"
>>>>>>> 2b004aa63be804033ecd81d14089a68b44f23816
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    Must be your registered university email
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                  )}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Special character</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                We've sent a verification link to <span className="font-medium text-gray-900">{formData.email}</span>. Please click the link to verify your email and complete your registration.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500">
                  After verification, you'll need to complete facial enrollment to activate your voting access.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          )}
        </div>

        {step < 3 && (
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
