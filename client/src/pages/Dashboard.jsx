import Navbar from '@/components/Navbar'
import StudentDashboard from './StudentDashboard'
import { useSelector } from 'react-redux'
import TeacherDashboard from './TeacherDashboard';
import AIHelper from '@/components/AIHelper';

const Dashboard = () => {
  const data = useSelector(state => state.auth);
  const user = data.user;


  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          {user && user.role === 'student' && (
            <StudentDashboard user={user} />
          )}
          {user && user.role === 'teacher' && (
           <TeacherDashboard user={user} />
          )}
        </div>
        <AIHelper/>
      </div>
    </>
  )
}

export default Dashboard
