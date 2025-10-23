import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, MapPin, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'trash', label: 'Trash Overflow', icon: '🗑️' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨' },
];

const ReportIssue = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock submission
    toast.success('Report submitted successfully!', {
      description: 'We will review your report and take action soon.',
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
    });
    
    setTimeout(() => {
      navigate('/my-reports');
    }, 1500);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          toast.success('Location captured successfully');
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Report a New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div className="space-y-3">
                <Label htmlFor="issue-type">Issue Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {issueTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedType === type.id
                          ? 'border-primary bg-primary/5 shadow-glow'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label htmlFor="photo">Add Photo</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-muted/30"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Tap to add photo</span>
                        </>
                      )}
                    </Label>
                  </div>
                  {imagePreview && (
                    <div className="h-40 rounded-xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Full preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Current Location (GPS)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief explanation of the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full btn-primary shadow-glow text-lg"
              >
                <Upload className="mr-2 w-5 h-5" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportIssue;
