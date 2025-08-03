/**
 * Parser multipart custom pour remplacer parse-multipart
 * Gère les données multipart/form-data de manière plus robuste
 */

/**
 * Parse les données multipart/form-data
 * @param {Buffer} buffer - Buffer contenant les données
 * @param {string} boundary - Boundary string
 * @returns {Array} Array of parsed parts
 */
const parseMultipart = (buffer, boundary) => {
  const parts = [];
  const boundaryBytes = Buffer.from(`--${boundary}`);
  const endBoundaryBytes = Buffer.from(`--${boundary}--`);
  
  let start = 0;
  
  // Trouver toutes les sections
  while (true) {
    const boundaryIndex = buffer.indexOf(boundaryBytes, start);
    if (boundaryIndex === -1) break;
    
    // Vérifier si c'est la fin
    const nextStart = boundaryIndex + boundaryBytes.length;
    if (buffer.indexOf(endBoundaryBytes, boundaryIndex) === boundaryIndex) {
      break;
    }
    
    // Trouver la prochaine boundary
    const nextBoundaryIndex = buffer.indexOf(boundaryBytes, nextStart);
    if (nextBoundaryIndex === -1) break;
    
    // Extraire la partie entre les boundaries
    const partBuffer = buffer.slice(nextStart, nextBoundaryIndex);
    const part = parsePart(partBuffer);
    
    if (part) {
      parts.push(part);
    }
    
    start = nextBoundaryIndex;
  }
  
  return parts;
};

/**
 * Parse une partie individuelle
 * @param {Buffer} partBuffer - Buffer de la partie
 * @returns {Object|null} Parsed part object
 */
const parsePart = (partBuffer) => {
  // Trouver la séparation headers/data (double CRLF)
  const headerEndIndex = partBuffer.indexOf('\r\n\r\n');
  if (headerEndIndex === -1) return null;
  
  const headersBuffer = partBuffer.slice(0, headerEndIndex);
  const dataBuffer = partBuffer.slice(headerEndIndex + 4);
  
  const headers = parseHeaders(headersBuffer.toString('utf8'));
  
  const part = {
    data: dataBuffer,
    headers: headers
  };
  
  // Extraire les informations du Content-Disposition
  const contentDisposition = headers['content-disposition'];
  if (contentDisposition) {
    const nameMatch = contentDisposition.match(/name="([^"]+)"/);
    if (nameMatch) {
      part.name = nameMatch[1];
    }
    
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    if (filenameMatch) {
      part.filename = filenameMatch[1];
    }
  }
  
  // Extraire le content-type
  const contentType = headers['content-type'];
  if (contentType) {
    part.type = contentType;
  }
  
  return part;
};

/**
 * Parse les headers d'une partie
 * @param {string} headersString - String contenant les headers
 * @returns {Object} Headers object
 */
const parseHeaders = (headersString) => {
  const headers = {};
  const lines = headersString.split('\r\n').filter(line => line.trim());
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const name = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim();
      headers[name] = value;
    }
  }
  
  return headers;
};

/**
 * Extraire la boundary du Content-Type
 * @param {string} contentType - Content-Type header
 * @returns {string|null} Boundary string
 */
const getBoundary = (contentType) => {
  if (!contentType) return null;
  
  const match = contentType.match(/boundary=([^;]+)/);
  if (!match) return null;
  
  let boundary = match[1].trim();
  
  // Supprimer les guillemets si présents
  if (boundary.startsWith('"') && boundary.endsWith('"')) {
    boundary = boundary.slice(1, -1);
  }
  
  return boundary;
};

module.exports = {
  parseMultipart,
  getBoundary
}; 
 