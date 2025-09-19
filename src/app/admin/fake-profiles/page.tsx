'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, CheckCircle, XCircle, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import { detectFakeProfile, DetectFakeProfileOutput } from '@/ai/flows/detect-fake-profile-flow';
import { cn } from '@/lib/utils';

export default function FakeProfileDetectorPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DetectFakeProfileOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please select a valid image file.',
      });
    }
  };
  
  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image to analyze.',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await detectFakeProfile({ photoDataUri: imagePreview });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getConfidenceColor = (score: number) => {
    if (score > 0.8) return 'text-red-500';
    if (score > 0.6) return 'text-orange-500';
    return 'text-yellow-500';
  }
  
  const getVerdictColor = (isFake: boolean) => {
      return isFake ? 'text-red-500' : 'text-green-500';
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Fake Profile Detector</h1>
        <p className="text-muted-foreground">
          Use AI to analyze profile pictures for signs of a fake identity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Analysis</CardTitle>
          <CardDescription>
            Upload a profile picture to check if it's a stock photo, a celebrity, or a widely used image.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-6 text-center">
            {imagePreview ? (
              <div className="relative w-48 h-48">
                <Image src={imagePreview} alt="Profile preview" layout="fill" className="rounded-full object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ShieldQuestion className="size-12" />
                <p>No image uploaded</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                <UploadCloud className="mr-2 size-4" />
                {imageFile ? 'Change Image' : 'Upload Image'}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleAnalyzeClick} disabled={!imageFile || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center rounded-lg bg-muted p-6">
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="size-12 animate-spin" />
                <p>AI is analyzing the image...</p>
              </div>
            ) : analysisResult ? (
              <div className="flex flex-col items-center gap-3 text-center">
                {analysisResult.isFake ? <XCircle className="size-16 text-red-500" /> : <CheckCircle className="size-16 text-green-500" />}
                <h3 className={cn("text-2xl font-bold", getVerdictColor(analysisResult.isFake))}>
                  {analysisResult.isFake ? 'Likely Fake Profile' : 'Appears Genuine'}
                </h3>
                <p className="text-muted-foreground font-medium">Reason: <span className="font-bold text-foreground">{analysisResult.reason}</span></p>
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-muted-foreground">Confidence:</p>
                  <span className={cn("text-4xl font-bold", getConfidenceColor(analysisResult.confidenceScore))}>
                    {Math.round(analysisResult.confidenceScore * 100)}%
                  </span>
                </div>
                 <div className="w-full h-2 bg-muted-foreground/20 rounded-full mt-2">
                    <div className={cn("h-2 rounded-full", analysisResult.isFake ? 'bg-red-500' : 'bg-green-500')} style={{width: `${analysisResult.confidenceScore * 100}%`}}/>
                  </div>
              </div>
            ) : (
               <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <ShieldQuestion className="size-12" />
                <p className="font-semibold">Awaiting Analysis</p>
                <p className="text-sm">Upload an image and click "Analyze" to see the AI's verdict.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
