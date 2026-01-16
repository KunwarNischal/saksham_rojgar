import Link from "next/link";

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <p className="text-lg text-gray-700 font-medium mb-3">
            {job.company}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            job.jobType === "Full-time"
              ? "bg-blue-100 text-blue-800"
              : job.jobType === "Part-time"
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {job.jobType}
        </span>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center text-gray-600">
            <span className="mr-2">💰</span>
            <span>{job.salary}</span>
          </div>
        )}
        <div className="flex items-center text-gray-600">
          <span className="mr-2">👥</span>
          <span>{job.applicants} applicants</span>
        </div>
      </div>

      <p className="text-gray-600 mt-4 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <span className="text-sm text-gray-500">
          Posted: {new Date(job.postedDate || job.createdAt).toLocaleDateString()}
        </span>
        <Link
          href={`/jobseeker/job-details/${job._id || job.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
