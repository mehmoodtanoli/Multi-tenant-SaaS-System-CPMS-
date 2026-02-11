const IconDashboard = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M4 13h7V4H4v9zm9 7h7V4h-7v16zM4 20h7v-5H4v5z" />
  </svg>
);

const IconProjects = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M3 7h6V3H3v4zm0 14h6V9H3v12zm8 0h10V13H11v8zm0-12h10V3H11v6z" />
  </svg>
);

const IconTasks = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M9 11H5v2h4v-2zm0 4H5v2h4v-2zm6-8H5v2h10V7zm4 0v10a2 2 0 0 1-2 2h-4v-2h4V7h2z" />
  </svg>
);

const IconMembers = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5C23 14.17 18.33 13 16 13z" />
  </svg>
);

const IconBell = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const IconSearch = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79L20 20.5 21.5 19 15.5 14zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
  </svg>
);

export {
  IconDashboard,
  IconProjects,
  IconTasks,
  IconMembers,
  IconBell,
  IconSearch,
};
