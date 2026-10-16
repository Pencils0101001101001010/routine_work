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
    distance: number;
    active: boolean;
    lastCheckedAt: Date | null;
}
export interface NotificationLog {
    id: string;
    user_id: string;
    job_match_id: string | null;
    status: "sent" | "failed";
    sent_at: string;
    job_title: string | null;
    company: string | null;
    source_url: string;
    external_job_id: string | null;
}
export interface UserPreference extends JobPreference {
    whatsappNumber: string;
    email: string;
}
export interface GroupedSearch {
    jobTitle: string;
    location: string;
    distance: number;
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
    company?: {
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
    company: string | null;
    sourceUrl: string;
}
export interface PreferenceNotMatched {
    id: string;
    user_id: string;
    preference_id: string;
    job_title: string;
    location: string;
}
//# sourceMappingURL=index.d.ts.map