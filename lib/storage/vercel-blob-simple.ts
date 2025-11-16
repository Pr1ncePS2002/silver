import { UploadResult } from '../upload'

const VERCEL_BLOB_API = 'https://api.vercel.com/v1/blob'
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.jwellery_READ_WRITE_TOKEN

if (!TOKEN) {

  console.warn('Vercel blob token is not configured (BLOB_READ_WRITE_TOKEN or jwellery_READ_WRITE_TOKEN)')
}

export async function uploadToVercelBlob(file: File, folder: string): Promise<UploadResult> {
  try {

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 12)
    const extension = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '')
    const filename = `${folder}/${timestamp}-${randomString}.${extension}`

    const createResp = await fetch(VERCEL_BLOB_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: filename,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
      }),
    })

    if (!createResp.ok) {
      const txt = await createResp.text().catch(() => '')
      throw new Error(`Vercel Blob create failed: ${createResp.status} ${createResp.statusText} - ${txt}`)
    }

    const createData = await createResp.json()

    const uploadURL: string | undefined = createData?.uploadURL || createData?.upload_url || createData?.upload_url_https
    const publicUrl: string | undefined = createData?.url || createData?.public_url

    if (!uploadURL || !publicUrl) {
      throw new Error('Vercel Blob create response missing uploadURL or url')
    }


    const bodyBuffer = await file.arrayBuffer()

    const putResp = await fetch(uploadURL, {
      method: 'PUT',
      headers: {

        'Content-Type': file.type || 'application/octet-stream',
      },
      body: bodyBuffer as any,
    })

    if (!putResp.ok) {
      const txt = await putResp.text().catch(() => '')
      throw new Error(`Vercel Blob upload (PUT) failed: ${putResp.status} ${putResp.statusText} - ${txt}`)
    }

    return {
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type || 'application/octet-stream',
    }
  } catch (err: any) {
    console.error('Vercel Blob upload error:', err)
    throw new Error(`Vercel Blob upload failed: ${err?.message ?? err}`)
  }
}

export async function deleteFromVercelBlob(url: string): Promise<boolean> {
  try {
    if (!TOKEN) throw new Error('Vercel blob token not configured')

    const parts = url.split('/').filter(Boolean)
    const blobId = parts[parts.length - 1] || url

    const resp = await fetch(`${VERCEL_BLOB_API}/${encodeURIComponent(blobId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    })

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '')
      console.error('Vercel Blob delete failed:', resp.status, resp.statusText, txt)
    }

    return resp.ok
  } catch (err) {
    console.error('Vercel Blob delete error:', err)
    return false
  }
}
