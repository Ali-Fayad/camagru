package com.camagru.utils;

import jakarta.servlet.http.HttpServletRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.*;

/**
 * Manual JSON utility (no external libraries).
 * Provides basic JSON parsing and building.
 * PHP equivalent: json_encode() and json_decode()
 */
public class JsonUtil {
    
    /**
     * Convert object to JSON string (basic implementation).
     * PHP equivalent: json_encode($data)
     * 
     * Supports: Map, List, String, Number, Boolean, null
     */
    public static String toJson(Object obj) {
        if (obj == null) {
            return "null";
        }
        
        if (obj instanceof String) {
            return "\"" + escapeJson((String) obj) + "\"";
        }
        
        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }
        
        if (obj instanceof Map) {
            return mapToJson((Map<?, ?>) obj);
        }
        
        if (obj instanceof List) {
            return listToJson((List<?>) obj);
        }
        
        // For custom objects, use reflection (basic implementation)
        return objectToJson(obj);
    }
    
    /**
     * Parse JSON string to Map.
     * PHP equivalent: json_decode($json, true)
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new HashMap<>();
        }
        
        json = json.trim();
        if (!json.startsWith("{") || !json.endsWith("}")) {
            throw new IllegalArgumentException("Invalid JSON object");
        }
        
        return (Map<String, Object>) parseValue(json);
    }
    
    /**
     * Read JSON from request body.
     * PHP equivalent: json_decode(file_get_contents('php://input'), true)
     */
    public static Map<String, Object> parseRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return parseJson(sb.toString());
    }
    
    // Helper methods
    
    private static String mapToJson(Map<?, ?> map) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<?, ?> entry : map.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(escapeJson(entry.getKey().toString())).append("\":");
            sb.append(toJson(entry.getValue()));
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }
    
    private static String listToJson(List<?> list) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (Object item : list) {
            if (!first) sb.append(",");
            sb.append(toJson(item));
            first = false;
        }
        sb.append("]");
        return sb.toString();
    }
    
    private static String objectToJson(Object obj) {
        Map<String, Object> map = new LinkedHashMap<>();
        
        try {
            java.lang.reflect.Method[] methods = obj.getClass().getMethods();
            for (java.lang.reflect.Method method : methods) {
                String name = method.getName();
                if (name.startsWith("get") && !name.equals("getClass") && method.getParameterCount() == 0) {
                    String fieldName = name.substring(3, 4).toLowerCase() + name.substring(4);
                    Object value = method.invoke(obj);
                    map.put(fieldName, value);
                } else if (name.startsWith("is") && method.getParameterCount() == 0) {
                    String fieldName = name.substring(2, 3).toLowerCase() + name.substring(3);
                    Object value = method.invoke(obj);
                    map.put(fieldName, value);
                }
            }
        } catch (Exception e) {
            // Fallback to toString
            return "\"" + escapeJson(obj.toString()) + "\"";
        }
        
        return mapToJson(map);
    }
    
    private static Object parseValue(String value) {
        value = value.trim();
        
        if (value.equals("null")) return null;
        if (value.equals("true")) return true;
        if (value.equals("false")) return false;
        
        if (value.startsWith("\"") && value.endsWith("\"")) {
            return unescapeJson(value.substring(1, value.length() - 1));
        }
        
        if (value.startsWith("{") && value.endsWith("}")) {
            return parseObject(value);
        }
        
        if (value.startsWith("[") && value.endsWith("]")) {
            return parseArray(value);
        }
        
        // Try parse as number
        try {
            if (value.contains(".")) {
                return Double.parseDouble(value);
            } else {
                return Integer.parseInt(value);
            }
        } catch (NumberFormatException e) {
            return value;
        }
    }
    
    private static Map<String, Object> parseObject(String json) {
        Map<String, Object> result = new LinkedHashMap<>();
        String content = json.substring(1, json.length() - 1).trim();
        
        if (content.isEmpty()) return result;
        
        List<String> pairs = splitJson(content, ',');
        for (String pair : pairs) {
            List<String> kv = splitJson(pair, ':');
            if (kv.size() == 2) {
                String key = kv.get(0).trim();
                if (key.startsWith("\"") && key.endsWith("\"")) {
                    key = unescapeJson(key.substring(1, key.length() - 1));
                }
                result.put(key, parseValue(kv.get(1).trim()));
            }
        }
        
        return result;
    }
    
    private static List<Object> parseArray(String json) {
        List<Object> result = new ArrayList<>();
        String content = json.substring(1, json.length() - 1).trim();
        
        if (content.isEmpty()) return result;
        
        List<String> items = splitJson(content, ',');
        for (String item : items) {
            result.add(parseValue(item.trim()));
        }
        
        return result;
    }
    
    private static List<String> splitJson(String str, char delimiter) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;
        
        for (char c : str.toCharArray()) {
            if (escaped) {
                current.append(c);
                escaped = false;
                continue;
            }
            
            if (c == '\\') {
                escaped = true;
                current.append(c);
                continue;
            }
            
            if (c == '"') {
                inString = !inString;
                current.append(c);
                continue;
            }
            
            if (!inString) {
                if (c == '{' || c == '[') depth++;
                if (c == '}' || c == ']') depth--;
                
                if (c == delimiter && depth == 0) {
                    result.add(current.toString());
                    current = new StringBuilder();
                    continue;
                }
            }
            
            current.append(c);
        }
        
        if (current.length() > 0) {
            result.add(current.toString());
        }
        
        return result;
    }
    
    private static String escapeJson(String str) {
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
    
    private static String unescapeJson(String str) {
        return str.replace("\\\"", "\"")
                  .replace("\\n", "\n")
                  .replace("\\r", "\r")
                  .replace("\\t", "\t")
                  .replace("\\\\", "\\");
    }
}
