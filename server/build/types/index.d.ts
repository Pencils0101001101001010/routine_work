export interface Users {
    id: string;
    name: string;
    email: string;
    whatsapp_number: string;
    password: string;
    is_active: boolean;
    created_at: string;
}
export interface JobPreference {
    id: string;
    userId: string;
    jobTitle: string;
    location: string;
    active: boolean;
    lastCheckedAt: Date | null;
}
export interface NotificationLog {
    user_id: string;
    job_match_id: string;
    status: string;
    sent_at: string;
}
export interface UserPreference extends JobPreference {
    whatsappNumber: string;
    email: string;
}
export interface GroupedSearch {
    jobTitle: string;
    location: string;
    users: {
        userId: string;
        whatsappNumber: string;
        email: string;
        preferenceId: string;
    }[];
}
export interface AdzunaJob {
    id: string;
    title: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
    };
    redirect_url: string;
}
export interface JobMatch {
    id: string;
    preferenceId: string;
    externalJobId: string;
    title: string;
    company: string;
    sourceUrl: string;
}
//# sourceMappingURL=index.d.ts.map