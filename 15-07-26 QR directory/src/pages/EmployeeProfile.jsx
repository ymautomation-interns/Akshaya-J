import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  BadgeCheck,
  Briefcase,
  Building2,
} from 'lucide-react';
import Badge from '../components/Badge';
import ProfileCard from '../components/ProfileCard';
import NotFound from '../components/NotFound';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useEmployeeById } from '../hooks/useEmployees';
import { formatDate, getInitials } from '../utils/qrUtils';
import './EmployeeProfile.css';

export default function EmployeeProfile() {
  const { id } = useParams();
  const employee = useEmployeeById(id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container profile-page">
        <LoadingSkeleton variant="summary" />
        <div className="profile-page__grid" style={{ marginTop: 20 }}>
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container profile-page">
        <NotFound
          code={id}
          title="Employee not found"
          message={`We couldn't find an employee with ID "${id}". They may have left the directory, or the code might be mistyped.`}
        />
      </div>
    );
  }

  return (
    <div className="container profile-page fade-in">
      <Link to="/" className="profile-page__back">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="profile-hero">
        <div className="profile-hero__avatar">
          {employee.profileImage ? (
            <img src={employee.profileImage} alt={employee.name} />
          ) : (
            <span>{getInitials(employee.name)}</span>
          )}
        </div>
        <div className="profile-hero__info">
          <div className="profile-hero__heading">
            <h1>{employee.name}</h1>
            <Badge status={employee.status} />
          </div>
          <p className="profile-hero__role">{employee.designation}</p>
          <div className="profile-hero__tags">
            <span>
              <Building2 size={14} /> {employee.department}
            </span>
            <span className="mono">
              <BadgeCheck size={14} /> {employee.employeeId}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-page__grid">
        <ProfileCard
          title="Contact"
          icon={Mail}
          fields={[
            { icon: Mail, label: 'Email', value: employee.email },
            { icon: Phone, label: 'Phone', value: employee.phone },
            { icon: MapPin, label: 'Address', value: employee.address },
          ]}
        />
        <ProfileCard
          title="Role"
          icon={Briefcase}
          fields={[
            { icon: Briefcase, label: 'Designation', value: employee.designation },
            { icon: Building2, label: 'Department', value: employee.department },
            { icon: BadgeCheck, label: 'Employee ID', value: employee.employeeId },
          ]}
        />
        <ProfileCard
          title="Employment"
          icon={Calendar}
          fields={[
            { icon: Calendar, label: 'Joining Date', value: formatDate(employee.joiningDate) },
            { icon: Droplet, label: 'Blood Group', value: employee.bloodGroup },
            { icon: BadgeCheck, label: 'Status', value: employee.status },
          ]}
        />
      </div>
    </div>
  );
}
