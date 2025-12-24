import { supabase } from './supabase'

/**
 * OAuth API functions for TanStack Query
 */
export const oauthApi = {
  /**
   * Get OAuth authorization details
   */
  getAuthorizationDetails: async (authorizationId: string) => {
    const { data, error } =
      await supabase.auth.oauth.getAuthorizationDetails(authorizationId)

    if (error) throw error
    return data
  },

  /**
   * Approve OAuth authorization
   */
  approveAuthorization: async (authorizationId: string) => {
    const { data, error } =
      await supabase.auth.oauth.approveAuthorization(authorizationId)

    if (error) throw error
    return data
  },

  /**
   * Deny OAuth authorization
   */
  denyAuthorization: async (authorizationId: string) => {
    const { data, error } =
      await supabase.auth.oauth.denyAuthorization(authorizationId)

    if (error) throw error
    return data
  },
}
