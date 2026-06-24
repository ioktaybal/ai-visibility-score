<?php
/**
 * Plugin Name: AI Visibility Score
 * Description: Instantly check your healthcare brand's visibility across AI ecosystems (ChatGPT, Google AI Overviews) right from your dashboard.
 * Version: 1.0.0
 * Author: AI Visibility Score
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Ensure we don't declare the class twice
if ( ! class_pack_exists( 'AIVisibilityScore_Widget' ) ) {
    
    class AIVisibilityScore_Widget {

        // The URL of our SaaS backend (will be set to localhost for development)
        private $api_url = 'http://localhost:3000/api/analyze';

        public function __construct() {
            add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
        }

        public function add_dashboard_widget() {
            wp_add_dashboard_widget(
                'ai_visibility_score_widget',
                'AI Visibility Score',
                array( $this, 'render_dashboard_widget' )
            );
        }

        public function render_dashboard_widget() {
            $site_url = get_site_url();
            
            // Check if we have a cached report ID
            $report_id = get_transient( 'aivs_report_id' );
            $score = get_transient( 'aivs_score' );
            $issue = get_transient( 'aivs_top_issue' );

            if ( false === $score ) {
                // We need to fetch the analysis from the API
                $response = wp_remote_post( $this->api_url, array(
                    'headers'     => array('Content-Type' => 'application/json; charset=utf-8'),
                    'body'        => json_encode( array( 'url' => $site_url ) ),
                    'method'      => 'POST',
                    'data_format' => 'body',
                    'timeout'     => 15 // analysis might take a bit if Playwright is used
                ));

                if ( is_wp_error( $response ) ) {
                    echo '<p style="color:red;">Error connecting to AI Visibility API. Please try again later.</p>';
                    return;
                }

                $body = wp_remote_retrieve_body( $response );
                $data = json_decode( $body, true );

                if ( isset( $data['reportId'] ) ) {
                    $report_id = $data['reportId'];
                    
                    // Fetch the full report details
                    $report_response = wp_remote_get( 'http://localhost:3000/api/report/' . $report_id );
                    
                    if ( ! is_wp_error( $report_response ) ) {
                        $report_data = json_decode( wp_remote_retrieve_body( $report_response ), true );
                        $score = $report_data['overall_score'];
                        if (!empty($report_data['recommendations'])) {
                            $issue = $report_data['recommendations'][0]['title'];
                        } else {
                            $issue = "Review your AI visibility profile.";
                        }
                        
                        // Cache for 24 hours
                        set_transient( 'aivs_report_id', $report_id, DAY_IN_SECONDS );
                        set_transient( 'aivs_score', $score, DAY_IN_SECONDS );
                        set_transient( 'aivs_top_issue', $issue, DAY_IN_SECONDS );
                    }
                } else {
                    echo '<p>Unable to generate score.</p>';
                    return;
                }
            }

            // Render the Widget
            echo '<div style="text-align: center; padding: 15px 0;">';
            
            // Score Circle (Simple CSS)
            $color = $score >= 70 ? '#10b981' : ($score >= 50 ? '#f59e0b' : '#ef4444');
            echo '<div style="margin: 0 auto 15px; width: 100px; height: 100px; border-radius: 50%; border: 8px solid ' . $color . '; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: #111827;">';
            echo esc_html( $score ) . '<span style="font-size:14px; color:#6b7280; margin-top:10px;">/100</span>';
            echo '</div>';

            // Top Issue
            echo '<p style="font-weight: 600; color: #ef4444; margin-bottom: 20px;">⚠️ ' . esc_html( $issue ) . '</p>';

            // Button
            $report_url = 'http://localhost:3000/report/' . esc_attr( $report_id );
            echo '<a href="' . esc_url( $report_url ) . '" target="_blank" style="display: inline-block; background: #000080; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-weight: 600;">Improve Visibility</a>';

            echo '</div>';
        }
    }

    new AIVisibilityScore_Widget();
}

function class_pack_exists($class_name) {
    return class_exists($class_name);
}
