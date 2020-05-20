/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function stackBlurImage(a,t,e,r){var n=document.getElementById(a),l=n.naturalWidth,g=n.naturalHeight,c=document.getElementById(t);c.style.width=l+"px",c.style.height=g+"px",c.width=l,c.height=g;var o=c.getContext("2d");o.clearRect(0,0,l,g),o.drawImage(n,0,0),isNaN(e)||e<1||(r?stackBlurCanvasRGBA(t,0,0,l,g,e):stackBlurCanvasRGB(t,0,0,l,g,e))}function stackBlurCanvasRGBA(a,t,e,r,n,l){if(!(isNaN(l)||l<1)){l|=0;var g,c=document.getElementById(a).getContext("2d");try{try{g=c.getImageData(t,e,r,n)}catch(a){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),g=c.getImageData(t,e,r,n)}catch(a){throw new Error("unable to access local image data: "+a)}}}catch(a){throw  new Error("unable to access image data: "+a)}var o,s,i,u,b,m,f,h,x,d,v,B,w,y,I,C,k,E,R,p,D,N,_,S,G=g.data,P=l+l+1,A=r-1,M=n-1,U=l+1,H=U*(U+1)/2,W=new BlurStack,j=W;for(i=1;i<P;i++)if(j=j.next=new BlurStack,i==U)var q=j;j.next=W;var z=null,F=null;f=m=0;var J=mul_table[l],K=shg_table[l];for(s=0;s<n;s++){for(C=k=E=R=h=x=d=v=0,B=U*(p=G[m]),w=U*(D=G[m+1]),y=U*(N=G[m+2]),I=U*(_=G[m+3]),h+=H*p,x+=H*D,d+=H*N,v+=H*_,j=W,i=0;i<U;i++)j.r=p,j.g=D,j.b=N,j.a=_,j=j.next;for(i=1;i<U;i++)u=m+((A<i?A:i)<<2),h+=(j.r=p=G[u])*(S=U-i),x+=(j.g=D=G[u+1])*S,d+=(j.b=N=G[u+2])*S,v+=(j.a=_=G[u+3])*S,C+=p,k+=D,E+=N,R+=_,j=j.next;for(z=W,F=q,o=0;o<r;o++)G[m+3]=_=v*J>>K,0!=_?(_=255/_,G[m]=(h*J>>K)*_,G[m+1]=(x*J>>K)*_,G[m+2]=(d*J>>K)*_):G[m]=G[m+1]=G[m+2]=0,h-=B,x-=w,d-=y,v-=I,B-=z.r,w-=z.g,y-=z.b,I-=z.a,u=f+((u=o+l+1)<A?u:A)<<2,h+=C+=z.r=G[u],x+=k+=z.g=G[u+1],d+=E+=z.b=G[u+2],v+=R+=z.a=G[u+3],z=z.next,B+=p=F.r,w+=D=F.g,y+=N=F.b,I+=_=F.a,C-=p,k-=D,E-=N,R-=_,F=F.next,m+=4;f+=r}for(o=0;o<r;o++){for(k=E=R=C=x=d=v=h=0,B=U*(p=G[m=o<<2]),w=U*(D=G[m+1]),y=U*(N=G[m+2]),I=U*(_=G[m+3]),h+=H*p,x+=H*D,d+=H*N,v+=H*_,j=W,i=0;i<U;i++)j.r=p,j.g=D,j.b=N,j.a=_,j=j.next;for(b=r,i=1;i<=l;i++)m=b+o<<2,h+=(j.r=p=G[m])*(S=U-i),x+=(j.g=D=G[m+1])*S,d+=(j.b=N=G[m+2])*S,v+=(j.a=_=G[m+3])*S,C+=p,k+=D,E+=N,R+=_,j=j.next,i<M&&(b+=r);for(m=o,z=W,F=q,s=0;s<n;s++)G[(u=m<<2)+3]=_=v*J>>K,_>0?(_=255/_,G[u]=(h*J>>K)*_,G[u+1]=(x*J>>K)*_,G[u+2]=(d*J>>K)*_):G[u]=G[u+1]=G[u+2]=0,h-=B,x-=w,d-=y,v-=I,B-=z.r,w-=z.g,y-=z.b,I-=z.a,u=o+((u=s+U)<M?u:M)*r<<2,h+=C+=z.r=G[u],x+=k+=z.g=G[u+1],d+=E+=z.b=G[u+2],v+=R+=z.a=G[u+3],z=z.next,B+=p=F.r,w+=D=F.g,y+=N=F.b,I+=_=F.a,C-=p,k-=D,E-=N,R-=_,F=F.next,m+=r}c.putImageData(g,t,e)}}function stackBlurCanvasRGB(a,t,e,r,n,l){if(!(isNaN(l)||l<1)){l|=0;var g,c=document.getElementById(a).getContext("2d");try{try{g=c.getImageData(t,e,r,n)}catch(a){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),g=c.getImageData(t,e,r,n)}catch(a){throw new Error("unable to access local image data: "+a)}}}catch(a){throw new Error("unable to access image data: "+a)}var o,s,i,u,b,m,f,h,x,d,v,B,w,y,I,C,k,E,R,p,D=g.data,N=l+l+1,_=r-1,S=n-1,G=l+1,P=G*(G+1)/2,A=new BlurStack,M=A;for(i=1;i<N;i++)if(M=M.next=new BlurStack,i==G)var U=M;M.next=A;var H=null,W=null;f=m=0;var j=mul_table[l],q=shg_table[l];for(s=0;s<n;s++){for(y=I=C=h=x=d=0,v=G*(k=D[m]),B=G*(E=D[m+1]),w=G*(R=D[m+2]),h+=P*k,x+=P*E,d+=P*R,M=A,i=0;i<G;i++)M.r=k,M.g=E,M.b=R,M=M.next;for(i=1;i<G;i++)u=m+((_<i?_:i)<<2),h+=(M.r=k=D[u])*(p=G-i),x+=(M.g=E=D[u+1])*p,d+=(M.b=R=D[u+2])*p,y+=k,I+=E,C+=R,M=M.next;for(H=A,W=U,o=0;o<r;o++)D[m]=h*j>>q,D[m+1]=x*j>>q,D[m+2]=d*j>>q,h-=v,x-=B,d-=w,v-=H.r,B-=H.g,w-=H.b,u=f+((u=o+l+1)<_?u:_)<<2,h+=y+=H.r=D[u],x+=I+=H.g=D[u+1],d+=C+=H.b=D[u+2],H=H.next,v+=k=W.r,B+=E=W.g,w+=R=W.b,y-=k,I-=E,C-=R,W=W.next,m+=4;f+=r}for(o=0;o<r;o++){for(I=C=y=x=d=h=0,v=G*(k=D[m=o<<2]),B=G*(E=D[m+1]),w=G*(R=D[m+2]),h+=P*k,x+=P*E,d+=P*R,M=A,i=0;i<G;i++)M.r=k,M.g=E,M.b=R,M=M.next;for(b=r,i=1;i<=l;i++)m=b+o<<2,h+=(M.r=k=D[m])*(p=G-i),x+=(M.g=E=D[m+1])*p,d+=(M.b=R=D[m+2])*p,y+=k,I+=E,C+=R,M=M.next,i<S&&(b+=r);for(m=o,H=A,W=U,s=0;s<n;s++)D[u=m<<2]=h*j>>q,D[u+1]=x*j>>q,D[u+2]=d*j>>q,h-=v,x-=B,d-=w,v-=H.r,B-=H.g,w-=H.b,u=o+((u=s+G)<S?u:S)*r<<2,h+=y+=H.r=D[u],x+=I+=H.g=D[u+1],d+=C+=H.b=D[u+2],H=H.next,v+=k=W.r,B+=E=W.g,w+=R=W.b,y-=k,I-=E,C-=R,W=W.next,m+=r}c.putImageData(g,t,e)}}function BlurStack(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}