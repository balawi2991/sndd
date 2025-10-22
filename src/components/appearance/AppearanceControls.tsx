import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, Plus, X, Bot, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AppearanceControlsProps {
  config: any;
  setConfig: (config: any) => void;
}

const AppearanceControls: React.FC<AppearanceControlsProps> = ({ config, setConfig }) => {
  const colorPresets = [
    '#17B26A', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  ];

  const addQuestion = () => {
    setConfig({
      ...config,
      suggestedQuestions: [...config.suggestedQuestions, ''],
    });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...config.suggestedQuestions];
    newQuestions[index] = value;
    setConfig({ ...config, suggestedQuestions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    setConfig({
      ...config,
      suggestedQuestions: config.suggestedQuestions.filter((_: string, i: number) => i !== index),
    });
  };

  return (
    <div className="enterprise-card p-6 space-y-6 h-fit">
      {/* Bot Personality Section */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Bot Personality</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="botName" className="text-sm font-medium text-gray-700">
            Bot Name
          </Label>
          <Input
            id="botName"
            value={config.botName || ''}
            onChange={(e) => setConfig({ ...config, botName: e.target.value })}
            placeholder="e.g., سليم حمود or Support Assistant"
            className="focus-calm"
          />
          <p className="text-xs text-gray-500">The name your bot will use when introducing itself</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="botRole" className="text-sm font-medium text-gray-700">
            Bot Role
          </Label>
          <Input
            id="botRole"
            value={config.botRole || ''}
            onChange={(e) => setConfig({ ...config, botRole: e.target.value })}
            placeholder="e.g., Customer Support Assistant"
            className="focus-calm"
          />
          <p className="text-xs text-gray-500">What role does your bot serve?</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={config.companyName || ''}
            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
            placeholder="e.g., Your Company Name"
            className="focus-calm"
          />
          <p className="text-xs text-gray-500">The company your bot represents</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium text-gray-700">
            Language
          </Label>
          <Select
            value={config.language || 'both'}
            onValueChange={(value) => setConfig({ ...config, language: value })}
          >
            <SelectTrigger className="focus-calm">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both (Auto-detect)</SelectItem>
              <SelectItem value="ar">Arabic Only</SelectItem>
              <SelectItem value="en">English Only</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Preferred response language</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium text-gray-700">
            Tone
          </Label>
          <Select
            value={config.tone || 'professional'}
            onValueChange={(value) => setConfig({ ...config, tone: value })}
          >
            <SelectTrigger className="focus-calm">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">How should your bot communicate?</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="greeting" className="text-sm font-medium text-gray-700">
            Custom Greeting
          </Label>
          <Textarea
            id="greeting"
            value={config.greeting || ''}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            placeholder="e.g., مرحباً! أنا هنا لمساعدتك"
            className="focus-calm min-h-[60px]"
          />
          <p className="text-xs text-gray-500">Optional custom greeting message</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialInstructions" className="text-sm font-medium text-gray-700">
            Special Instructions
          </Label>
          <Textarea
            id="specialInstructions"
            value={config.specialInstructions || ''}
            onChange={(e) => setConfig({ ...config, specialInstructions: e.target.value })}
            placeholder="e.g., Always mention our 24/7 support availability"
            className="focus-calm min-h-[80px]"
          />
          <p className="text-xs text-gray-500">Additional instructions for your bot's behavior</p>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Widget Appearance</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Company Logo</Label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            {config.logo ? (
              <img src={config.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <Upload className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            )}
          </div>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Primary Color</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {colorPresets.map((color) => (
            <button
              key={color}
              onClick={() => setConfig({ ...config, primaryColor: color })}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                config.primaryColor === color ? 'border-gray-900 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Input
          type="text"
          value={config.primaryColor}
          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
          placeholder="#17B26A"
          className="font-mono focus-calm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Position</Label>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Center-Bottom (Fixed)</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium text-gray-700">Glowing Border</Label>
          <p className="text-xs text-gray-500">Add a subtle glow effect</p>
        </div>
        <Switch
          checked={config.glowingBorder}
          onCheckedChange={(checked) => setConfig({ ...config, glowingBorder: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Agent Avatar</Label>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            {config.avatar ? (
              <img src={config.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            )}
          </div>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium text-gray-700">Show Floating Avatar</Label>
          <p className="text-xs text-gray-500">Display avatar in chat bubble</p>
        </div>
        <Switch
          checked={config.showFloatingAvatar}
          onCheckedChange={(checked) => setConfig({ ...config, showFloatingAvatar: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="Chat with us"
          className="focus-calm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder" className="text-sm font-medium text-gray-700">
          Chat Input Placeholder
        </Label>
        <Input
          id="placeholder"
          value={config.placeholder}
          onChange={(e) => setConfig({ ...config, placeholder: e.target.value })}
          placeholder="Type your message..."
          className="focus-calm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">Suggested Questions</Label>
          <Button onClick={addQuestion} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {config.suggestedQuestions.map((question: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="Enter a question..."
                className="focus-calm"
              />
              <Button
                onClick={() => removeQuestion(index)}
                size="icon"
                variant="ghost"
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearanceControls;