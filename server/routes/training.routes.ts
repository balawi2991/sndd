import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import TrainingMaterial from '../models/TrainingMaterial.model';
import { indexMaterial } from '../services/rag.service';

const router = express.Router();

// Get all training materials
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type } = req.query;
    const filter: any = { userId: req.userId };
    
    if (type && type !== 'all') {
      filter.type = type;
    }

    const materials = await TrainingMaterial.find(filter)
      .sort({ createdAt: -1 })
      .select('-embeddings -content')
      .lean();

    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add file
router.post('/file', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, content, fileType, fileSize } = req.body;

    const material = new TrainingMaterial({
      userId: req.userId,
      type: 'file',
      title,
      content,
      characters: content.length,
      metadata: { fileType, fileSize },
      status: 'untrained',
    });

    await material.save();

    // Index in background
    indexMaterial(material._id.toString()).catch(console.error);

    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add link
router.post('/link', authenticate, async (req: AuthRequest, res) => {
  try {
    const { url, title, content } = req.body;

    const material = new TrainingMaterial({
      userId: req.userId,
      type: 'link',
      title: title || url,
      content,
      source: url,
      characters: content.length,
      metadata: { url },
      status: 'untrained',
    });

    await material.save();

    // Index in background
    indexMaterial(material._id.toString()).catch(console.error);

    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add text
router.post('/text', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, content } = req.body;

    const material = new TrainingMaterial({
      userId: req.userId,
      type: 'text',
      title,
      content,
      characters: content.length,
      status: 'untrained',
    });

    await material.save();

    // Index in background
    indexMaterial(material._id.toString()).catch(console.error);

    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrain material
router.post('/:id/retrain', authenticate, async (req: AuthRequest, res) => {
  try {
    const material = await TrainingMaterial.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    material.status = 'training';
    await material.save();

    // Index in background
    indexMaterial(material._id.toString()).catch(console.error);

    res.json({ message: 'Retraining started' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete material
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await TrainingMaterial.deleteOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ message: 'Material deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
