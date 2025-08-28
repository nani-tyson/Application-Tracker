import Application from "../models/Application.js";

// Add new candidate
export const addApplication = async (req, res) => {
  try {
    const { candidateName, role, yearsOfExperience, resumeLink } = req.body;

    const application = new Application({
      candidateName,
      role,
      yearsOfExperience,
      resumeLink,
      createdBy: req.user.id, 
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications (with filters)
export const getApplications = async (req, res) => {
  try {
    const { role, status, minExp, maxExp, page = 1, limit = 10 } = req.query;

    let filter = { createdBy: req.user.id };

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (minExp || maxExp) {
      filter.yearsOfExperience = {};
      if (minExp) filter.yearsOfExperience.$gte = Number(minExp);
      if (maxExp) filter.yearsOfExperience.$lte = Number(maxExp);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const totalApplications = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      total: totalApplications,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalApplications / Number(limit)),
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update application status (drag & drop)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
