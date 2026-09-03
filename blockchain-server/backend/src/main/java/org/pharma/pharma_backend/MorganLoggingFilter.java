package org.pharma.pharma_backend;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

/**
 * Morgan-style Real-Time HTTP Request & Response Logging Filter for Blockchain Gateway.
 * 
 * Provides colorized, single-line logs in Morgan format:
 * [HTTP-MORGAN] GET /api/transition/status?packHash=... 200 14 ms - 222 B [127.0.0.1]
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MorganLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("HTTP");

    // ANSI Color Codes
    private static final String RESET   = "\u001B[0m";
    private static final String BOLD    = "\u001B[1m";
    private static final String RED     = "\u001B[31m";
    private static final String GREEN   = "\u001B[32m";
    private static final String YELLOW  = "\u001B[33m";
    private static final String CYAN    = "\u001B[36m";
    private static final String WHITE   = "\u001B[37m";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(request, responseWrapper);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = responseWrapper.getStatus();
            int responseSize = responseWrapper.getContentSize();
            responseWrapper.copyBodyToResponse(); // Flush cached response back to client

            logMorgan(request, status, duration, responseSize);
        }
    }

    private void logMorgan(HttpServletRequest request, int status, long duration, int responseSize) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        String fullPath = (query != null && !query.isBlank()) ? uri + "?" + query : uri;

        String methodColored = colorMethod(method);
        String statusColored = colorStatus(status);
        String timeFormatted = formatDuration(duration);
        String sizeFormatted = formatSize(responseSize);
        String clientIp = getClientIp(request);

        String logLine = String.format(
            "%s %-6s%s %-50s %s %s - %s [%s]",
            BOLD + "[HTTP-MORGAN]" + RESET,
            methodColored,
            RESET,
            fullPath,
            statusColored,
            timeFormatted,
            sizeFormatted,
            clientIp
        );

        if (status >= 500) {
            log.error(logLine);
        } else if (status >= 400) {
            log.warn(logLine);
        } else {
            log.info(logLine);
        }
    }

    private String colorMethod(String method) {
        switch (method.toUpperCase()) {
            case "GET":    return CYAN + BOLD + method + RESET;
            case "POST":   return GREEN + BOLD + method + RESET;
            case "PUT":    return YELLOW + BOLD + method + RESET;
            case "DELETE": return RED + BOLD + method + RESET;
            default:       return WHITE + BOLD + method + RESET;
        }
    }

    private String colorStatus(int status) {
        if (status >= 500) {
            return RED + BOLD + status + RESET;
        } else if (status >= 400) {
            return YELLOW + BOLD + status + RESET;
        } else if (status >= 300) {
            return CYAN + BOLD + status + RESET;
        } else if (status >= 200) {
            return GREEN + BOLD + status + RESET;
        }
        return WHITE + BOLD + status + RESET;
    }

    private String formatDuration(long ms) {
        if (ms < 100) {
            return GREEN + ms + " ms" + RESET;
        } else if (ms < 500) {
            return YELLOW + ms + " ms" + RESET;
        } else {
            return RED + ms + " ms" + RESET;
        }
    }

    private String formatSize(int bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }
        return String.format("%.1f KB", bytes / 1024.0);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
