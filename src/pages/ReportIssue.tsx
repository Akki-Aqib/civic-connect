import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, MapPin, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'trash', label: 'Trash Overflow', icon: '🗑️' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡' },
  { id: 'water', label: 'Water Leakage', icon: '💧' },
  { id: 'road', label: 'Road Damage', icon: '🚧' },
  { id: 'others', label: 'Others', icon: '📋' },
];

const ReportIssue = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to report an issue');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
          toast.success('Location captured successfully');
        },
        () => {
          setGettingLocation(false);
          toast.error('Unable to get your location. Please enable location services.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !description || !state || !city || !pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!location) {
      toast.error('Please capture your location');
      return;
    }

    if (!user) {
      toast.error('Please login to submit a report');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if exists
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('report-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert report
      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          type: selectedType,
          description: description,
          state: state,
          city: city,
          village: village || null,
          pincode: pincode,
          latitude: location.lat,
          longitude: location.lng,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      toast.success('Report submitted successfully!', {
        description: 'We will review your report and take action soon.',
      });
      
      setTimeout(() => {
        navigate('/my-reports');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} />
      
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
                <Label>Issue Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  required
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="village">Village/Area</Label>
                  <Input
                    id="village"
                    placeholder="e.g., Andheri"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 400001"
                    pattern="[0-9]{6}"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* GPS Location */}
              <div className="space-y-3">
                <Label>GPS Location *</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {gettingLocation
                    ? 'Getting location...'
                    : location
                    ? `Location captured (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                    : 'Capture Current Location'}
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full btn-primary shadow-glow text-lg"
                disabled={isSubmitting}
              >
                <Upload className="mr-2 w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportIssue;
