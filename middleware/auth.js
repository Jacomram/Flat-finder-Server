// Authentication and Authorization Middleware

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  // This would typically check for a JWT token or session
  // For now, we'll assume user info is passed in headers or req.user is set
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // In a real implementation, you would verify the JWT token here
  // For demonstration purposes, we'll simulate this
  try {
    // Simulate token verification and user extraction
    // In reality: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // For demo, we'll expect user info in a specific header format
    const userInfo = req.headers['x-user-info'];
    if (!userInfo) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    
    req.user = JSON.parse(userInfo);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// Middleware to check if user is admin or account owner
const requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const userId = req.params.id || req.user.id;
  
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ message: 'Admin privileges or account ownership required' });
  }
};

// Middleware to check if user is the flat owner
const requireFlatOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const flatId = req.params.id;
    
    // Here you would check if the user owns the flat
    // For now, we'll simulate this check
    // In reality: const flat = await Flat.findById(flatId);
    // if (flat.ownerId !== req.user.id) { return res.status(403)... }
    
    // For demonstration, we'll assume the check passes
    // You should implement the actual database check here
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error checking flat ownership' });
  }
};

// Middleware to check if user is the message sender
const requireMessageSender = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const senderId = req.params.senderId;
  
  if (req.user.id === senderId) {
    next();
  } else {
    return res.status(403).json({ message: 'Can only access your own messages' });
  }
};

module.exports = {
  requireLogin,
  requireAdmin,
  requireAdminOrOwner,
  requireFlatOwner,
  requireMessageSender
};