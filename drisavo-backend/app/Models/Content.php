<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'title',
        'content',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get content by key
     */
    public static function getByKey($key)
    {
        return static::where('key', $key)->where('is_active', true)->first();
    }

    /**
     * Update content by key
     */
    public static function updateByKey($key, $content)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['content' => $content, 'is_active' => true]
        );
    }

    /**
     * Scope for active content
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}