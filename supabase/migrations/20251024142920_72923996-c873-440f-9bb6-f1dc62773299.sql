-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true);

-- Storage policies for report images
CREATE POLICY "Anyone can view report images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'report-images');

CREATE POLICY "Authenticated users can upload report images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'report-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own report images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'report-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );